import axios from 'axios';

export const fetchBook = async (bookId) => {
  try {
    
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
    const proxiedUrl = `${proxyUrl}${encodeURIComponent(contentUrl)}`;

    const response = await axios.get(proxiedUrl);
    
  
    let content = response.data;

    const startMatch = content.match(/\*\*\* START OF .*?\*\*\*/i);
    if (startMatch) {
      content = content.substring(content.indexOf(startMatch[0]) + startMatch[0].length);
    }
    

    const endMatch = content.match(/\*\*\* END OF .*?\*\*\*/i);
    if (endMatch) {
      content = content.substring(0, content.indexOf(endMatch[0]));
    }
    

    return content.trim();
  } catch (error) {
    throw new Error(`Failed to fetch book ${bookId}: ${error.message}`);
  }
};