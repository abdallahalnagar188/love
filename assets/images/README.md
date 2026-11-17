# 📸 Couple & Memory Photos Folder

You can place your photos directly here and reference them in `js/config.js`.

### Recommended Naming:
- `assets/images/photo1.jpg`
- `assets/images/photo2.jpg`
- `assets/images/photo3.jpg`
- ...

### How to use them:
Open `js/config.js` and update the `photos` array:

```javascript
photos: [
  {
    src: "assets/images/photo1.jpg",
    title: "أول نظرة.. وبداية كل شيء",
    caption: "في اليوم الذي التقت فيه أعيننا لأول مرة...",
    date: "سبتمبر 2023",
    location: "أول لقاء ☕",
    rotation: "-2deg"
  },
  // ...
]
```

> **Tip:** You can also use direct cloud / image links (such as Google Drive direct links, Imgur, Cloudinary, or Unsplash) directly in `js/config.js`!
