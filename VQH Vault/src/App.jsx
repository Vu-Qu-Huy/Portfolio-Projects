import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { ImageGrid } from "@/components/ImageGrid";
import { ImageModal } from "@/components/ImageModal";

function App() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("search");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useLocalStorage("viewMode", "masonry");
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const searchImagesWithSupabase = async (
    query,
    pageNum = 1,
    append = false
  ) => {
    if (!query.trim()) {
      setImages([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "getUnsplashImages",
        {
          body: JSON.stringify({ query, pageNum, perPage: 10 }),
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data || !data.results) {
        console.error("Invalid data structure from Supabase function:", data);
        throw new Error("Received invalid data from the server.");
      }

      if (data.demoData && data.error) {
        toast({
          title: "Using Demo Data",
          description: data.error,
          variant: "default",
          duration: 7000,
        });
      }

      const newImages = data.results.map((img) => ({
        id: img.id,
        urls: { regular: img.urls.regular, small: img.urls.small },
        alt_description: img.alt_description || "Untitled Image",
        user: {
          name: img.user.name || "Unknown Artist",
          links: { html: img.user.links.html || "#" },
        },
        tags: img.tags || [],
        width: img.width,
        height: img.height,
      }));

      if (append) {
        setImages((prev) => [...prev, ...newImages]);
      } else {
        setImages(newImages);
        setPage(1);
      }
      setHasMore(data.total_pages > pageNum && newImages.length > 0);

      if (!data.demoData && newImages.length > 0) {
        toast({
          title: "Search completed!",
          description: `Found ${data.total} images for "${query}". Displaying ${newImages.length}.`,
        });
      } else if (!data.demoData && newImages.length === 0) {
        toast({
          title: "No results",
          description: `No images found for "${query}".`,
        });
      }
    } catch (error) {
      console.error("Error invoking Supabase function:", error);
      toast({
        title: "Search Failed",
        description: `Could not fetch images: ${error.message}. Please try again.`,
        variant: "destructive",
      });
      setImages([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchImagesWithSupabase(searchQuery, 1, false);
      setCurrentView("search");
    } else {
      setImages([]);
      setHasMore(false);
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    searchImagesWithSupabase(tag, 1, false);
    setCurrentView("search");
  };

  const toggleFavorite = (image) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === image.id);
      if (isAlreadyFavorite) {
        toast({
          title: "Removed from favorites",
          description: `${
            image.alt_description || "Image"
          } removed from your collection`,
        });
        return prev.filter((fav) => fav.id !== image.id);
      } else {
        toast({
          title: "Added to favorites",
          description: `${
            image.alt_description || "Image"
          } saved to your collection`,
        });
        return [...prev, image];
      }
    });
  };

  const isFavorite = (imageId) => {
    return favorites.some((fav) => fav.id === imageId);
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "inspovault-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Image is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const copyAttribution = (image) => {
    const attribution = `Photo by ${image.user.name} on Unsplash (${image.user.links.html})`;
    navigator.clipboard.writeText(attribution);
    toast({
      title: "Attribution copied",
      description: "Attribution text copied to clipboard",
    });
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchImagesWithSupabase(searchQuery, nextPage, true);
    }
  };

  const displayImages = currentView === "favorites" ? favorites : images;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <Toaster />
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        favoritesCount={favorites.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {currentView === "search" && (
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleTagClick={handleTagClick}
          loading={loading}
        />
      )}

      <ImageGrid
        images={displayImages}
        viewMode={viewMode}
        setSelectedImage={setSelectedImage}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        loading={loading}
        hasMore={hasMore && currentView === "search"}
        loadMore={loadMore}
        currentView={currentView}
      />

      <ImageModal
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        downloadImage={downloadImage}
        copyAttribution={copyAttribution}
      />
    </div>
  );
}

export default App;
