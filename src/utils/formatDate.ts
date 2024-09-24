export  const formatDate = (createdAt: string): string => {
    const now = Date.now();
    const postDate = new Date(createdAt).getTime();
    const diffInMs = (now)-(postDate) ;
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHour / 24);
  
    if (diffInSec < 60) {
      return 'just now';
    } else if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInHour < 24) {
      return `${diffInHour} hour ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day ago`;
    } else {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(postDate).toLocaleDateString('en-US', options as any);
    }
  };