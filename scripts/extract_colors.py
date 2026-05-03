import sys
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

def extract_colors(image_path, n_clusters=5):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        
        # Resize to speed up k-means, but keeping aspect ratio
        img.thumbnail((300, 300))
        img_np = np.array(img)
        
        # Reshape to a list of pixels
        pixels = img_np.reshape(-1, 3)
        
        # Run KMeans
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        colors = kmeans.cluster_centers_
        labels = kmeans.labels_
        
        # Calculate percentage of each color
        counts = np.bincount(labels)
        percentages = counts / len(pixels)
        
        # Sort by percentage
        sorted_indices = np.argsort(percentages)[::-1]
        
        print(f"--- Dominant Colors for {image_path} ---")
        for idx in sorted_indices:
            color = colors[idx]
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(color[0]), int(color[1]), int(color[2]))
            print(f"{hex_color} - {percentages[idx]*100:.2f}%")
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            extract_colors(arg, n_clusters=5)
    else:
        print("Please provide an image path.")
