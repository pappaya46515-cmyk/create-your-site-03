// Example of how to add photos to the About page
// 1. First, upload your photos to src/assets/ folder
// 2. Then import them at the top of About.tsx like this:

import omGaneshLogo from "@/assets/om-ganesh-official-logo.jpg";
// Add your photo imports here:
// import bhaskarPhoto from "@/assets/bhaskar-kamath.jpg";
// import harshaPhoto from "@/assets/harsha-kamath.jpg";
// import shaliniPhoto from "@/assets/shalini-kamath.jpg";
// import vishwasPhoto from "@/assets/vishwas-kamath.jpg";
// import teamPhoto from "@/assets/team-photo.jpg";
// import tractorPhoto from "@/assets/massey-ferguson.jpg";

// 3. Then replace the placeholder divs with img tags:

// EXAMPLE - Replace this:
<div className="h-48 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900 dark:to-red-800 flex items-center justify-center">
  <Users className="h-24 w-24 text-red-600 dark:text-red-400 opacity-50" />
</div>

// WITH THIS (after importing the photo):
<img 
  src={bhaskarPhoto} 
  alt="Mr. Bhaskar Kamath" 
  className="h-48 w-full object-cover"
/>

// For the gallery section, replace icon placeholders with actual images:
<img 
  src={teamPhoto} 
  alt="Om Ganesh Team" 
  className="w-full h-48 object-cover rounded"
/>