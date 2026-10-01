import json

try:
    from backend.app.database.db import get_db, dict_from_row
    from backend.app.auth.jwt_handler import hash_password
except ImportError:
    from app.database.db import get_db, dict_from_row
    from app.auth.jwt_handler import hash_password

CATEGORIES_DATA = [
    {
        "name": "Sarees",
        "slug": "sarees",
        "description": "Exquisite handwoven Banarasi, Kanjeevaram, Organza and Chiffon sarees",
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "display_order": 1
    },
    {
        "name": "Kurtis",
        "slug": "kurtis",
        "description": "Daily elegance to festive Chikankari, Anarkali & straight cotton kurtis",
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        "display_order": 2
    },
    {
        "name": "Dresses",
        "slug": "dresses",
        "description": "Contemporary chic, breezy midis, evening gowns and tiered dresses",
        "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        "display_order": 3
    },
    {
        "name": "Tops",
        "slug": "tops",
        "description": "Stylized peplum tops, embroidered crop blouses and relaxed tunics",
        "image_url": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
        "display_order": 4
    },
    {
        "name": "Salwar Suits",
        "slug": "salwar-suits",
        "description": "Regal Punjabi suits, Pakistani suits and flared Sharara ensembles",
        "image_url": "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80",
        "display_order": 5
    },
    {
        "name": "Lehengas",
        "slug": "lehengas",
        "description": "Bridal, sangeet and festival lehengas with opulent zari & sequins",
        "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "display_order": 6
    },
    {
        "name": "Ethnic Wear",
        "slug": "ethnic-wear",
        "description": "Fusion Indo-western sets, dhoti pants, capes and co-ords",
        "image_url": "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
        "display_order": 7
    },
    {
        "name": "Western Wear",
        "slug": "western-wear",
        "description": "Smart blazers, tailored trousers, shirts and designer co-ords",
        "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        "display_order": 8
    },
    {
        "name": "Kids Wear",
        "slug": "kids-wear",
        "description": "Adorable traditional pavadas, lehenga cholis and kurta pyjamas for kids",
        "image_url": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
        "display_order": 9
    },
    {
        "name": "Accessories",
        "slug": "accessories",
        "description": "Embroidered potli bags, handcrafted jhumkas, and heritage jewelry",
        "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        "display_order": 10
    }
]

PRODUCTS_DATA = [
    {
        "name": "Zari Embroidered Banarasi Silk Saree",
        "slug": "zari-embroidered-banarasi-silk-saree",
        "category_slug": "sarees",
        "description": "Draped in luxury, this pure Banarasi katan silk saree features intricate antique gold zari floral motifs across the body and an ornate pallu. Comes with an unstitched matching blouse piece with border detailing.",
        "original_price": 5499,
        "discounted_price": 3299,
        "discount_percent": 40,
        "stock": 24,
        "fabric": "Pure Banarasi Katan Silk",
        "sku": "AUR-SAR-001",
        "rating": 4.8,
        "reviews_count": 142,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Free Size", "color": "Wine Burgundy", "color_code": "#58111A", "stock": 10},
            {"size": "Free Size", "color": "Emerald Green", "color_code": "#0B5345", "stock": 8},
            {"size": "Free Size", "color": "Royal Navy", "color_code": "#1B263B", "stock": 6}
        ]
    },
    {
        "name": "Floral Anarkali Pure Mulmul Kurti Set",
        "slug": "floral-anarkali-pure-mulmul-kurti-set",
        "category_slug": "kurtis",
        "description": "Crafted from breathable premium mulmul cotton, this flattering flare Anarkali kurti showcases hand-screen printed floral vines with subtle gota patti neckline work. Includes tailored straight pants and a featherlight kota doria dupatta.",
        "original_price": 2899,
        "discounted_price": 1699,
        "discount_percent": 41,
        "stock": 35,
        "fabric": "100% Breathable Mulmul Cotton",
        "sku": "AUR-KUR-002",
        "rating": 4.6,
        "reviews_count": 89,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Blush Pink", "color_code": "#E8C4C8", "stock": 8},
            {"size": "M", "color": "Blush Pink", "color_code": "#E8C4C8", "stock": 12},
            {"size": "L", "color": "Blush Pink", "color_code": "#E8C4C8", "stock": 9},
            {"size": "XL", "color": "Blush Pink", "color_code": "#E8C4C8", "stock": 6}
        ]
    },
    {
        "name": "Rose Gold Sequin Heavy Bridal Lehenga",
        "slug": "rose-gold-sequin-heavy-bridal-lehenga",
        "category_slug": "lehengas",
        "description": "A showstopper bridal & sangeet masterpiece in delicate rose gold net layered over shimmer satin. Encrusted with micro sequins, cut-dana and swarovski elements with double dupatta and padded sweetheart blouse.",
        "original_price": 18999,
        "discounted_price": 12499,
        "discount_percent": 34,
        "stock": 8,
        "fabric": "Shimmer Satin & Imported Soft Net",
        "sku": "AUR-LEH-003",
        "rating": 4.9,
        "reviews_count": 64,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Rose Gold", "color_code": "#B76E79", "stock": 2},
            {"size": "M", "color": "Rose Gold", "color_code": "#B76E79", "stock": 4},
            {"size": "L", "color": "Rose Gold", "color_code": "#B76E79", "stock": 2}
        ]
    },
    {
        "name": "Chikankari Handcrafted Georgette Kurta",
        "slug": "chikankari-handcrafted-georgette-kurta",
        "category_slug": "kurtis",
        "description": "Authentic Lucknowi craftsmanship featuring delicate shadow work, tepchi and phanda stitches. Includes a soft dyed inner slip. Comfortable for both festive celebrations and stylish summer days.",
        "original_price": 2499,
        "discounted_price": 1499,
        "discount_percent": 40,
        "stock": 28,
        "fabric": "Pure Viscose Georgette",
        "sku": "AUR-KUR-004",
        "rating": 4.7,
        "reviews_count": 112,
        "is_featured": 1,
        "is_trending": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Lavender Mist", "color_code": "#E6E6FA", "stock": 7},
            {"size": "M", "color": "Lavender Mist", "color_code": "#E6E6FA", "stock": 9},
            {"size": "L", "color": "Lavender Mist", "color_code": "#E6E6FA", "stock": 8},
            {"size": "XL", "color": "Lavender Mist", "color_code": "#E6E6FA", "stock": 4}
        ]
    },
    {
        "name": "Burgundy Velvet Evening Maxi Dress",
        "slug": "burgundy-velvet-evening-maxi-dress",
        "category_slug": "dresses",
        "description": "Slinky, tailored silhouette in ultra-soft micro velvet with a gathered twist waistline, plunging V-neck, and delicate gold waist accent. Perfect for winter weddings and cocktail soirees.",
        "original_price": 4200,
        "discounted_price": 2799,
        "discount_percent": 33,
        "stock": 18,
        "fabric": "Premium Micro Stretch Velvet",
        "sku": "AUR-DRE-005",
        "rating": 4.8,
        "reviews_count": 48,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "XS", "color": "Deep Burgundy", "color_code": "#58111A", "stock": 3},
            {"size": "S", "color": "Deep Burgundy", "color_code": "#58111A", "stock": 6},
            {"size": "M", "color": "Deep Burgundy", "color_code": "#58111A", "stock": 5},
            {"size": "L", "color": "Deep Burgundy", "color_code": "#58111A", "stock": 4}
        ]
    },
    {
        "name": "Pastel Organza Floral Hand-Painted Saree",
        "slug": "pastel-organza-floral-hand-painted-saree",
        "category_slug": "sarees",
        "description": "Airy, ethereal pure silk organza saree with delicate hand-painted pastel blossoms and scallop cut-work embroidery borders. Paired with a contrast raw silk unstitched blouse.",
        "original_price": 4999,
        "discounted_price": 3199,
        "discount_percent": 36,
        "stock": 20,
        "fabric": "Tissue Silk Organza",
        "sku": "AUR-SAR-006",
        "rating": 4.9,
        "reviews_count": 76,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Free Size", "color": "Mint Pistachio", "color_code": "#93C572", "stock": 10},
            {"size": "Free Size", "color": "Peach Sorbet", "color_code": "#FFDAB9", "stock": 10}
        ]
    },
    {
        "name": "Raw Silk Peplum Top & Dhoti Set",
        "slug": "raw-silk-peplum-top-dhoti-set",
        "category_slug": "ethnic-wear",
        "description": "Modern fusion luxury featuring a structured raw silk peplum top with mirror work embroidery, paired with draped satin georgette pre-pleated dhoti pants and statement belt.",
        "original_price": 3999,
        "discounted_price": 2499,
        "discount_percent": 38,
        "stock": 16,
        "fabric": "Raw Silk & Satin Georgette",
        "sku": "AUR-ETH-007",
        "rating": 4.5,
        "reviews_count": 39,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Mustard Gold", "color_code": "#E5A93B", "stock": 4},
            {"size": "M", "color": "Mustard Gold", "color_code": "#E5A93B", "stock": 7},
            {"size": "L", "color": "Mustard Gold", "color_code": "#E5A93B", "stock": 5}
        ]
    },
    {
        "name": "Emerald Jacquard Silk Flared Sharara Suit",
        "slug": "emerald-jacquard-silk-flared-sharara-suit",
        "category_slug": "salwar-suits",
        "description": "Regal bottle green jacquard kurti with intricate gold foil wefts, paired with a 3-tiered heavy volume sharara and scalloped organza dupatta with latkan tassels.",
        "original_price": 4899,
        "discounted_price": 2999,
        "discount_percent": 39,
        "stock": 22,
        "fabric": "Art Jacquard Silk & Shantoon",
        "sku": "AUR-SAL-008",
        "rating": 4.7,
        "reviews_count": 92,
        "is_featured": 1,
        "is_trending": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "M", "color": "Bottle Green", "color_code": "#0B5345", "stock": 8},
            {"size": "L", "color": "Bottle Green", "color_code": "#0B5345", "stock": 9},
            {"size": "XL", "color": "Bottle Green", "color_code": "#0B5345", "stock": 5}
        ]
    },
    {
        "name": "Handblock Printed Bohemian Tiered Maxi Dress",
        "slug": "handblock-printed-bohemian-tiered-maxi-dress",
        "category_slug": "dresses",
        "description": "Handcrafted with natural indigo dyes by Sanganeri artisans. Features tiered flares, bell sleeves, wooden buttons, and a cinched drawstring tie waist.",
        "original_price": 2699,
        "discounted_price": 1599,
        "discount_percent": 41,
        "stock": 30,
        "fabric": "100% Organic Sanganeri Cotton",
        "sku": "AUR-DRE-009",
        "rating": 4.6,
        "reviews_count": 84,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Indigo Blue", "color_code": "#1A2B4C", "stock": 10},
            {"size": "M", "color": "Indigo Blue", "color_code": "#1A2B4C", "stock": 12},
            {"size": "L", "color": "Indigo Blue", "color_code": "#1A2B4C", "stock": 8}
        ]
    },
    {
        "name": "Handwoven Kanjeevaram Bridal Silk Saree",
        "slug": "handwoven-kanjeevaram-bridal-silk-saree",
        "category_slug": "sarees",
        "description": "Authentic temple border Kanjeevaram silk saree with pure zari woven peacocks and chakram motifs. Heavy contrasting red pallu and rich silk finish.",
        "original_price": 12999,
        "discounted_price": 7999,
        "discount_percent": 38,
        "stock": 12,
        "fabric": "Pure Mulberry Silk with Gold Zari",
        "sku": "AUR-SAR-010",
        "rating": 5.0,
        "reviews_count": 105,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 0,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Free Size", "color": "Royal Crimson Red", "color_code": "#8B0000", "stock": 6},
            {"size": "Free Size", "color": "Golden Ochre", "color_code": "#DAA520", "stock": 6}
        ]
    },
    {
        "name": "Embroidered Velvet Festive Potli Bag",
        "slug": "embroidered-velvet-festive-potli-bag",
        "category_slug": "accessories",
        "description": "Plush royal maroon velvet potli purse embellished with pearl beads, zardozi work and a braided pearl handle strap. Spacious enough to hold smartphones and cosmetic essentials.",
        "original_price": 1499,
        "discounted_price": 899,
        "discount_percent": 40,
        "stock": 45,
        "fabric": "Heavy Micro Velvet & Faux Pearls",
        "sku": "AUR-ACC-011",
        "rating": 4.8,
        "reviews_count": 133,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Standard", "color": "Maroon Gold", "color_code": "#800000", "stock": 25},
            {"size": "Standard", "color": "Champagne Cream", "color_code": "#FDFBF7", "stock": 20}
        ]
    },
    {
        "name": "Kundan & Pearl Statement Choker Necklace Set",
        "slug": "kundan-pearl-statement-choker-necklace-set",
        "category_slug": "accessories",
        "description": "Handcrafted brass alloy choker set finished with 22k micron gold plating, untreated uncut kundan stones and clustered green beads. Includes matching jhumki earrings and maang tikka.",
        "original_price": 2999,
        "discounted_price": 1799,
        "discount_percent": 40,
        "stock": 25,
        "fabric": "22k Gold Micron Plated Brass & Hydro Stones",
        "sku": "AUR-ACC-012",
        "rating": 4.9,
        "reviews_count": 98,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Free Size", "color": "Green Kundan", "color_code": "#005F41", "stock": 15},
            {"size": "Free Size", "color": "Ruby Pink Kundan", "color_code": "#9B111E", "stock": 10}
        ]
    },
    {
        "name": "Handcrafted Mirror Work Bandhani Lehenga",
        "slug": "handcrafted-mirror-work-bandhani-lehenga",
        "category_slug": "lehengas",
        "description": "Traditional Gujarati bandhej printed silk lehenga highlighted with authentic hand-stitched abhla mirror borders and festive tassels. Paired with a heavy raw silk choli.",
        "original_price": 9999,
        "discounted_price": 6499,
        "discount_percent": 35,
        "stock": 14,
        "fabric": "Bandhani Silk & Georgette",
        "sku": "AUR-LEH-013",
        "rating": 4.8,
        "reviews_count": 55,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Hot Rani Pink", "color_code": "#C2185B", "stock": 4},
            {"size": "M", "color": "Hot Rani Pink", "color_code": "#C2185B", "stock": 6},
            {"size": "L", "color": "Hot Rani Pink", "color_code": "#C2185B", "stock": 4}
        ]
    },
    {
        "name": "Chanderi Silk Straight Festive Kurti Set",
        "slug": "chanderi-silk-straight-festive-kurti-set",
        "category_slug": "kurtis",
        "description": "Luminous pure Chanderi silk with woven zari booties across the front. Tailored with three-quarter sleeves, cotton lining, matching silk pants and an organza dupatta.",
        "original_price": 3299,
        "discounted_price": 1999,
        "discount_percent": 39,
        "stock": 26,
        "fabric": "Pure Chanderi Silk with Santoon Lining",
        "sku": "AUR-KUR-014",
        "rating": 4.7,
        "reviews_count": 78,
        "is_featured": 0,
        "is_trending": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "M", "color": "Teal Blue", "color_code": "#008080", "stock": 10},
            {"size": "L", "color": "Teal Blue", "color_code": "#008080", "stock": 10},
            {"size": "XL", "color": "Teal Blue", "color_code": "#008080", "stock": 6}
        ]
    },
    {
        "name": "Ivory Pearl Embroidered Peplum Blouse",
        "slug": "ivory-pearl-embroidered-peplum-blouse",
        "category_slug": "tops",
        "description": "Modern luxury party blouse in raw silk, featuring structured corseted waist boning, hand-sewn pearl vines along the neckline and back keyhole fastening.",
        "original_price": 1999,
        "discounted_price": 1299,
        "discount_percent": 35,
        "stock": 20,
        "fabric": "Raw Silk & Soft Cotton",
        "sku": "AUR-TOP-015",
        "rating": 4.6,
        "reviews_count": 42,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Ivory Cream", "color_code": "#FDFBF7", "stock": 6},
            {"size": "M", "color": "Ivory Cream", "color_code": "#FDFBF7", "stock": 8},
            {"size": "L", "color": "Ivory Cream", "color_code": "#FDFBF7", "stock": 6}
        ]
    },
    {
        "name": "Girls Traditional Silk Pavada Lehenga Set",
        "slug": "girls-traditional-silk-pavada-lehenga-set",
        "category_slug": "kids-wear",
        "description": "Precious south silk pattu pavada for girls featuring rich contrasting zari borders, comfortable cotton inner lining, and easy elastic waistbands. Ideal for festivals and family poojas.",
        "original_price": 2199,
        "discounted_price": 1399,
        "discount_percent": 36,
        "stock": 30,
        "fabric": "Art Silk & Pure Cotton Lining",
        "sku": "AUR-KID-016",
        "rating": 4.9,
        "reviews_count": 68,
        "is_featured": 1,
        "is_trending": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "2-3 Years", "color": "Ruby Red & Gold", "color_code": "#8B0000", "stock": 10},
            {"size": "4-5 Years", "color": "Ruby Red & Gold", "color_code": "#8B0000", "stock": 10},
            {"size": "6-7 Years", "color": "Ruby Red & Gold", "color_code": "#8B0000", "stock": 10}
        ]
    },
    {
        "name": "Boys Silk Blend Kurta Pyjama with Jacket",
        "slug": "boys-silk-blend-kurta-pyjama-with-jacket",
        "category_slug": "kids-wear",
        "description": "Three-piece celebration set for young boys including a comfortable silk blend straight kurta, churidar pyjama, and a printed brocade Nehru jacket with metallic buttons.",
        "original_price": 2399,
        "discounted_price": 1499,
        "discount_percent": 37,
        "stock": 25,
        "fabric": "Silk Blend & Brocade",
        "sku": "AUR-KID-017",
        "rating": 4.7,
        "reviews_count": 52,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "3-4 Years", "color": "Royal Blue", "color_code": "#1A237E", "stock": 8},
            {"size": "5-6 Years", "color": "Royal Blue", "color_code": "#1A237E", "stock": 10},
            {"size": "7-8 Years", "color": "Royal Blue", "color_code": "#1A237E", "stock": 7}
        ]
    },
    {
        "name": "Tailored Double-Breasted Linen Blazer & Trouser",
        "slug": "tailored-double-breasted-linen-blazer-trouser",
        "category_slug": "western-wear",
        "description": "Effortless high-street luxury. Crafted from breathable Italian linen blend in neutral sand tone. Features peak lapels, tortoise shell buttons, and high-rise relaxed pleated trousers.",
        "original_price": 4999,
        "discounted_price": 3499,
        "discount_percent": 30,
        "stock": 15,
        "fabric": "Italian Linen & Viscose Blend",
        "sku": "AUR-WES-018",
        "rating": 4.8,
        "reviews_count": 34,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Sand Beige", "color_code": "#C2B280", "stock": 4},
            {"size": "M", "color": "Sand Beige", "color_code": "#C2B280", "stock": 6},
            {"size": "L", "color": "Sand Beige", "color_code": "#C2B280", "stock": 5}
        ]
    },
    {
        "name": "Handmade Meenakari Floral Chandbali Earrings",
        "slug": "handmade-meenakari-floral-chandbali-earrings",
        "category_slug": "accessories",
        "description": "Authentic Rajasthani royal meenakari hand-painted crescent earrings studded with freshwater pearls, kundan gems and delicate jingling ghungroos.",
        "original_price": 1299,
        "discounted_price": 749,
        "discount_percent": 42,
        "stock": 50,
        "fabric": "Hand-painted Brass & Freshwater Pearls",
        "sku": "AUR-ACC-019",
        "rating": 4.8,
        "reviews_count": 145,
        "is_featured": 0,
        "is_trending": 1,
        "is_new": 0,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Standard", "color": "Turquoise Pink", "color_code": "#E91E63", "stock": 30},
            {"size": "Standard", "color": "Emerald Pearl", "color_code": "#0B5345", "stock": 20}
        ]
    },
    {
        "name": "Pastel Pink Ruffled Organza Cocktail Gown",
        "slug": "pastel-pink-ruffled-organza-cocktail-gown",
        "category_slug": "dresses",
        "description": "Fairy-tale tiered silhouette with micro pleated organza frills, corseted bodice with boning support and detachable sheer organza shoulder bow ties.",
        "original_price": 6499,
        "discounted_price": 4199,
        "discount_percent": 35,
        "stock": 14,
        "fabric": "Micro Organza & Satin Lining",
        "sku": "AUR-DRE-020",
        "rating": 4.9,
        "reviews_count": 62,
        "is_featured": 1,
        "is_trending": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Blush Rose", "color_code": "#E8C4C8", "stock": 4},
            {"size": "M", "color": "Blush Rose", "color_code": "#E8C4C8", "stock": 6},
            {"size": "L", "color": "Blush Rose", "color_code": "#E8C4C8", "stock": 4}
        ]
    },
    {
        "name": "Linen Silk Relaxed Fit Embroidered Tunic",
        "slug": "linen-silk-relaxed-fit-embroidered-tunic",
        "category_slug": "tops",
        "description": "Effortless casual luxury. Breathable linen-silk blend tunic featuring delicate tonal threadwork down the placket, slit mandarin collar and high side vents.",
        "original_price": 1899,
        "discounted_price": 1199,
        "discount_percent": 37,
        "stock": 30,
        "fabric": "Linen Silk Blend",
        "sku": "AUR-TOP-021",
        "rating": 4.5,
        "reviews_count": 44,
        "is_featured": 0,
        "is_trending": 0,
        "is_new": 1,
        "is_bestseller": 0,
        "images": [
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "S", "color": "Olive Sage", "color_code": "#8A9A5B", "stock": 10},
            {"size": "M", "color": "Olive Sage", "color_code": "#8A9A5B", "stock": 12},
            {"size": "L", "color": "Olive Sage", "color_code": "#8A9A5B", "stock": 8}
        ]
    },
    {
        "name": "Kashmiri Aari Embroidered Woolen Shawl",
        "slug": "kashmiri-aari-embroidered-woolen-shawl",
        "category_slug": "accessories",
        "description": "Authentic Kashmiri wool shawl embellished with timeless Persian Paisley patterns and fine aari needlework. Luxuriously warm, light-weight and soft on skin.",
        "original_price": 3499,
        "discounted_price": 2199,
        "discount_percent": 37,
        "stock": 20,
        "fabric": "Pure Fine Merino Wool",
        "sku": "AUR-ACC-022",
        "rating": 4.9,
        "reviews_count": 87,
        "is_featured": 1,
        "is_trending": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "images": [
            "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80"
        ],
        "variants": [
            {"size": "Free Size", "color": "Ivory Antique", "color_code": "#FFFFF0", "stock": 10},
            {"size": "Free Size", "color": "Ebony Black", "color_code": "#1A1A1A", "stock": 10}
        ]
    }
]

COUPONS_DATA = [
    {
        "code": "WELCOME100",
        "discount_type": "flat",
        "discount_value": 100,
        "min_order_value": 499,
        "max_discount": 100,
        "expiry_date": "2027-12-31",
        "is_active": 1
    },
    {
        "code": "FESTIVE20",
        "discount_type": "percentage",
        "discount_value": 20,
        "min_order_value": 1499,
        "max_discount": 800,
        "expiry_date": "2027-12-31",
        "is_active": 1
    },
    {
        "code": "AURALUXE15",
        "discount_type": "percentage",
        "discount_value": 15,
        "min_order_value": 1999,
        "max_discount": 1500,
        "expiry_date": "2027-12-31",
        "is_active": 1
    },
    {
        "code": "SUMMER50",
        "discount_type": "flat",
        "discount_value": 50,
        "min_order_value": 299,
        "max_discount": 50,
        "expiry_date": "2027-12-31",
        "is_active": 1
    }
]

SAMPLE_REVIEWS = [
    {
        "product_id": 1,
        "user_name": "Ananya Sengupta",
        "rating": 5,
        "comment": "The fabric quality of this Banarasi silk saree is simply sublime! The zari shine is subtle and regal, exactly what I was hoping for. Received endless compliments at my cousin's wedding.",
        "images": ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"]
    },
    {
        "product_id": 1,
        "user_name": "Meera Raman",
        "rating": 5,
        "comment": "Super fast delivery and luxurious packaging! The wine burgundy tone looks even richer in person. Beautiful boutique craftsmanship.",
        "images": []
    },
    {
        "product_id": 2,
        "user_name": "Divya Patel",
        "rating": 4,
        "comment": "Very comfortable mulmul cotton. Light, breezy and the fitting of the Anarkali cut is very flattering. Highly recommended for daily and office wear!",
        "images": []
    },
    {
        "product_id": 3,
        "user_name": "Kavita Reddy",
        "rating": 5,
        "comment": "Bought this for my Sangeet night and it was truly breathtaking! The sequin work catches the light so beautifully and the fitting was spot on.",
        "images": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80"]
    }
]

def seed_database():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Seed Users
        cursor.execute("SELECT COUNT(*) as count FROM users")
        if cursor.fetchone()["count"] == 0:
            admin_pwd = hash_password("Admin@123")
            cust_pwd = hash_password("Customer@123")
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, phone, avatar)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ("Aura Boutique Admin", "admin@auraboutique.com", admin_pwd, "admin", "+91 98765 43210", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"))
            
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role, phone, avatar)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ("Priya Sharma", "customer@auraboutique.com", cust_pwd, "customer", "+91 98123 45678", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"))

        # 2. Seed Categories
        cursor.execute("SELECT COUNT(*) as count FROM categories")
        if cursor.fetchone()["count"] == 0:
            for cat in CATEGORIES_DATA:
                cursor.execute("""
                    INSERT INTO categories (name, slug, description, image_url, display_order)
                    VALUES (?, ?, ?, ?, ?)
                """, (cat["name"], cat["slug"], cat["description"], cat["image_url"], cat["display_order"]))

        # Map category slug to id
        cursor.execute("SELECT id, slug FROM categories")
        cat_map = {row["slug"]: row["id"] for row in cursor.fetchall()}

        # 3. Seed Products
        cursor.execute("SELECT COUNT(*) as count FROM products")
        if cursor.fetchone()["count"] == 0:
            for prod in PRODUCTS_DATA:
                cat_id = cat_map.get(prod["category_slug"], 1)
                cursor.execute("""
                    INSERT INTO products (
                        name, slug, description, category_id, original_price, discounted_price,
                        discount_percent, stock, fabric, sku, rating, reviews_count,
                        is_featured, is_trending, is_new, is_bestseller
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    prod["name"], prod["slug"], prod["description"], cat_id,
                    prod["original_price"], prod["discounted_price"], prod["discount_percent"],
                    prod["stock"], prod["fabric"], prod["sku"], prod["rating"],
                    prod["reviews_count"], prod["is_featured"], prod["is_trending"],
                    prod["is_new"], prod["is_bestseller"]
                ))
                product_id = cursor.lastrowid
                
                # Seed Product Images
                for idx, img_url in enumerate(prod["images"]):
                    cursor.execute("""
                        INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                        VALUES (?, ?, ?, ?)
                    """, (product_id, img_url, 1 if idx == 0 else 0, idx))
                
                # Seed Product Variants
                for variant in prod["variants"]:
                    cursor.execute("""
                        INSERT INTO product_variants (product_id, size, color, color_code, stock)
                        VALUES (?, ?, ?, ?, ?)
                    """, (product_id, variant["size"], variant["color"], variant["color_code"], variant["stock"]))
            
            # Update product count on categories
            for cat_slug, cat_id in cat_map.items():
                cursor.execute("SELECT COUNT(*) as count FROM products WHERE category_id = ?", (cat_id,))
                cnt = cursor.fetchone()["count"]
                cursor.execute("UPDATE categories SET product_count = ? WHERE id = ?", (cnt, cat_id))

        # 4. Seed Coupons
        cursor.execute("SELECT COUNT(*) as count FROM coupons")
        if cursor.fetchone()["count"] == 0:
            for coup in COUPONS_DATA:
                cursor.execute("""
                    INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, expiry_date, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (coup["code"], coup["discount_type"], coup["discount_value"], coup["min_order_value"], coup["max_discount"], coup["expiry_date"], coup["is_active"]))

        # 5. Seed Reviews
        cursor.execute("SELECT COUNT(*) as count FROM reviews")
        if cursor.fetchone()["count"] == 0:
            for rev in SAMPLE_REVIEWS:
                cursor.execute("""
                    INSERT INTO reviews (product_id, user_id, user_name, rating, comment, images_json, verified_purchase)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (rev["product_id"], 2, rev["user_name"], rev["rating"], rev["comment"], json.dumps(rev["images"]), 1))

        # 6. Seed Address for Customer (user_id = 2)
        cursor.execute("SELECT COUNT(*) as count FROM addresses WHERE user_id = 2")
        if cursor.fetchone()["count"] == 0:
            cursor.execute("""
                INSERT INTO addresses (
                    user_id, full_name, mobile_number, house_flat, street, area, city, district, state, pin_code, is_default, address_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                2, "Priya Sharma", "+91 98123 45678", "Villa 42, Lotus Boulevard",
                "Park Avenue Road", "Indiranagar", "Bengaluru", "Bengaluru Urban",
                "Karnataka", "560038", 1, "Home"
            ))

        # 7. Seed Sample Past Order for Customer
        cursor.execute("SELECT COUNT(*) as count FROM orders WHERE user_id = 2")
        if cursor.fetchone()["count"] == 0:
            shipping_addr = {
                "full_name": "Priya Sharma",
                "mobile_number": "+91 98123 45678",
                "house_flat": "Villa 42, Lotus Boulevard",
                "street": "Park Avenue Road",
                "area": "Indiranagar",
                "city": "Bengaluru",
                "state": "Karnataka",
                "pin_code": "560038"
            }
            cursor.execute("""
                INSERT INTO orders (
                    order_number, user_id, customer_name, customer_email, customer_phone,
                    total_amount, discount_amount, delivery_charge, net_amount, payment_method,
                    payment_status, order_status, shipping_address_json, estimated_delivery,
                    tracking_number, courier_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "AUR-2026-9812", 2, "Priya Sharma", "customer@auraboutique.com", "+91 98123 45678",
                3299.0, 100.0, 0.0, 3199.0, "UPI", "Paid", "Shipped",
                json.dumps(shipping_addr), "Expected in 2 days", "BLUEDART-88231940", "Bluedart Express"
            ))
            order_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO order_items (
                    order_id, product_id, product_name, product_image, size, color, quantity, unit_price, total_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, 1, "Zari Embroidered Banarasi Silk Saree",
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
                "Free Size", "Wine Burgundy", 1, 3299.0, 3299.0
            ))

            tracking_steps = [
                ("Order Placed", "Your order has been received and verified.", "Boutique HQ - Mumbai"),
                ("Order Confirmed", "Artisan hand-inspection complete. Packed in premium box.", "Boutique Fulfillment Center"),
                ("Packed", "Package labeled and dispatched to hub.", "Mumbai Central Hub"),
                ("Shipped", "In transit via Bluedart Air Cargo to Bengaluru Hub.", "Air Hub Terminal 2")
            ]
            for status, desc, loc in tracking_steps:
                cursor.execute("""
                    INSERT INTO order_tracking (order_id, status, description, location)
                    VALUES (?, ?, ?, ?)
                """, (order_id, status, desc, loc))

            cursor.execute("""
                INSERT INTO payments (order_id, payment_id, method, amount, status, transaction_ref)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (order_id, "pay_sim_98124912", "UPI", 3199.0, "Completed", "UPI/261001/992819"))

        # 8. Seed Notifications for Customer
        cursor.execute("SELECT COUNT(*) as count FROM notifications WHERE user_id = 2")
        if cursor.fetchone()["count"] == 0:
            notifs = [
                ("Order Shipped!", "Your order #AUR-2026-9812 has been shipped via Bluedart Express.", "order", "/orders"),
                ("Festival Special: 20% OFF", "Use code FESTIVE20 to enjoy 20% off on all royal Lehengas & Sarees!", "promo", "/shop"),
                ("Welcome to Aura Atelier", "Thank you for joining our exclusive boutique family. Enjoy your boutique shopping experience!", "info", "/profile")
            ]
            for title, msg, ntype, link in notifs:
                cursor.execute("""
                    INSERT INTO notifications (user_id, title, message, type, link)
                    VALUES (?, ?, ?, ?, ?)
                """, (2, title, msg, ntype, link))
