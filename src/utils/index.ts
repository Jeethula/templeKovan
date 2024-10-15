import toast from "react-hot-toast";

export const copyToClipboard = (url: string) => {
    if(!url) return;
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard');
  }

export const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'sece.live',
          text: 'An open-source platform for sharing your thoughts and ideas in a anonymous way',
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(url);
    }
  }