# Initialize git repository
git init

# Create README with project description
echo "# Vita-Romana" >> README.md
echo "" >> README.md
echo "An interactive 3D Ancient Rome experience built with Three.js" >> README.md
echo "" >> README.md
echo "## Features" >> README.md
echo "- Explore the Forum Romanum and Colosseum" >> README.md
echo "- Interact with historically accurate Roman characters" >> README.md
echo "- Dynamic friendship system based on dialogue choices" >> README.md
echo "- Attend gladiatorial games" >> README.md
echo "" >> README.md
echo "## How to Play" >> README.md
echo "Open index.html in a modern web browser" >> README.md

# Rename your HTML file to index.html (required for GitHub Pages)
mv your-file.html index.html

# Add all files
git add README.md
git add index.html

# First commit
git commit -m "first commit"

# Set main branch
git branch -M main

# Add remote (replace with your actual username)
git remote add origin https://github.com/ukmadman/Vita-Romana.git

# Push to GitHub
git push -u origin main
