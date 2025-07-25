import { Router, Request, Response } from "express";

const router = Router();

interface ScriptureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  pages: ScripturePage[];
}

interface ScripturePage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  analysisId: string;
}

interface Analysis {
  object_recognition: {
    category: string;
    specific_type: string;
    confidence: number;
    cultural_significance: string;
  };
  text_extraction: {
    extracted_text: string;
    metadata: {
      museum_name?: string;
      location?: string;
      year?: string;
      additional_info?: string;
    };
  };
  cultural_analysis: {
    origin_region: string;
    historical_period: string;
    traditional_use: string;
    artistic_elements: string[];
    preservation_notes?: string;
  };
  educational_content: {
    fun_facts: string[];
    related_culture: string;
    modern_relevance: string;
  };
}

// Temporary in-memory storage - replace with actual database
const scriptureDatabase: Record<string, ScriptureItem> = {
  '1': {
    id: '1',
    title: 'Peninggalan Raja Jawa',
    category: 'Jawa',
    description: 'Koleksi prasasti dan artefak dari era Kerajaan Majapahit yang memberikan wawasan mendalam tentang sistem pemerintahan dan budaya masyarakat Jawa pada abad ke-13-15.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/jawa1/400/600',
        analysisId: 'analysis_1_1' // Reference to analysis in separate collection
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/jawa2/400/600',
        analysisId: 'analysis_1_2'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Arsitektur Sunda Kuno',
    category: 'Sunda',
    description: 'Dokumentasi arsitektur tradisional Sunda yang menampilkan keunikan desain dan filosofi bangunan yang harmonis dengan alam.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/sunda1/400/600',
        analysisId: 'analysis_2_1'
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/sunda2/400/600',
        analysisId: 'analysis_2_2'
      },
      {
        id: 'p3',
        pageNumber: 3,
        imageUrl: 'https://picsum.photos/seed/sunda3/400/600',
        analysisId: 'analysis_2_3'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Warisan Budaya Bali',
    category: 'Bali',
    description: 'Eksplorasi mendalam tentang warisan budaya Bali yang kaya, termasuk seni ukir, arsitektur pura, dan tradisi keagamaan yang turun temurun.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/bali1/400/600',
        analysisId: 'analysis_3_1'
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/bali2/400/600',
        analysisId: 'analysis_3_2'
      },
      {
        id: 'p3',
        pageNumber: 3,
        imageUrl: 'https://picsum.photos/seed/bali3/400/600',
        analysisId: 'analysis_3_3'
      },
      {
        id: 'p4',
        pageNumber: 4,
        imageUrl: 'https://picsum.photos/seed/bali4/400/600',
        analysisId: 'analysis_3_4'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Kerajaan Sumatra',
    category: 'Sumatra',
    description: 'Jejak-jejak peradaban Kerajaan Sriwijaya dan warisan budaya Sumatra yang mempengaruhi perdagangan maritim di Asia Tenggara.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/sumatra1/400/600',
        analysisId: 'analysis_4_1'
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/sumatra2/400/600',
        analysisId: 'analysis_4_2'
      }
    ]
  },
  '5': {
    id: '5',
    title: 'Tradisi Kalimantan',
    category: 'Kalimantan',
    description: 'Eksplorasi budaya Dayak dan tradisi adat Kalimantan yang unik, termasuk seni ukir, rumah Betang, dan ritual tradisional.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/kalimantan1/400/600',
        analysisId: 'analysis_5_1'
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/kalimantan2/400/600',
        analysisId: 'analysis_5_2'
      },
      {
        id: 'p3',
        pageNumber: 3,
        imageUrl: 'https://picsum.photos/seed/kalimantan3/400/600',
        analysisId: 'analysis_5_3'
      },
      {
        id: 'p4',
        pageNumber: 4,
        imageUrl: 'https://picsum.photos/seed/kalimantan4/400/600',
        analysisId: 'analysis_5_4'
      },
      {
        id: 'p5',
        pageNumber: 5,
        imageUrl: 'https://picsum.photos/seed/kalimantan5/400/600',
        analysisId: 'analysis_5_5'
      }
    ]
  },
  '6': {
    id: '6',
    title: 'Candi Jawa Tengah',
    category: 'Jawa',
    description: 'Studi mendalam tentang arsitektur dan relief candi-candi di Jawa Tengah, termasuk Borobudur, Prambanan, dan candi-candi lainnya.',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        imageUrl: 'https://picsum.photos/seed/candi1/400/600',
        analysisId: 'analysis_6_1'
      },
      {
        id: 'p2',
        pageNumber: 2,
        imageUrl: 'https://picsum.photos/seed/candi2/400/600',
        analysisId: 'analysis_6_2'
      },
      {
        id: 'p3',
        pageNumber: 3,
        imageUrl: 'https://picsum.photos/seed/candi3/400/600',
        analysisId: 'analysis_6_3'
      }
    ]
  }
};

// Sample analysis data - this would typically come from your scan analysis
const analysisDatabase: Record<string, Analysis> = {
  'analysis_1_1': {
    object_recognition: {
      category: 'Prasasti Batu',
      specific_type: 'Prasasti Kerajaan Majapahit',
      confidence: 0.92,
      cultural_significance: 'Dokumen penting yang mencatat peristiwa bersejarah dan sistem pemerintahan Majapahit'
    },
    text_extraction: {
      extracted_text: 'Swasti Śri Śaka warṣa 1215 kārttika māsa tithi pañcami śuklapakṣa...',
      metadata: {
        museum_name: 'Museum Nasional Indonesia',
        location: 'Trowulan, Jawa Timur',
        year: '1293 M',
        additional_info: 'Prasasti pendirian candi'
      }
    },
    cultural_analysis: {
      origin_region: 'Kerajaan Majapahit, Jawa Timur',
      historical_period: 'Abad ke-13-15 M, Periode Kerajaan Majapahit',
      traditional_use: 'Dokumen resmi kerajaan untuk mencatat peristiwa penting',
      artistic_elements: ['Aksara Kawi', 'Ornamen floral', 'Motif geometris'],
      preservation_notes: 'Dalam kondisi baik dengan beberapa bagian yang aus'
    },
    educational_content: {
      fun_facts: [
        'Prasasti ini menggunakan sistem penanggalan Saka',
        'Ditulis dalam bahasa Jawa Kuno dengan aksara Kawi',
        'Menandai pembangunan candi yang membutuhkan waktu 15 tahun'
      ],
      related_culture: 'Tradisi penulisan prasasti pada era Hindu-Buddha di Nusantara',
      modern_relevance: 'Memberikan pemahaman tentang sistem administrasi dan kepercayaan masyarakat Jawa pada masa lalu'
    }
  },
  'analysis_1_2': {
    object_recognition: {
      category: 'Relief Candi',
      specific_type: 'Relief Naratif Majapahit',
      confidence: 0.88,
      cultural_significance: 'Representasi visual dari cerita epik dan kehidupan sosial masyarakat Majapahit'
    },
    text_extraction: {
      extracted_text: 'Gambar relief menunjukkan prosesi kerajaan dan aktivitas ritual...',
      metadata: {
        location: 'Candi Tikus, Trowulan',
        year: 'Abad ke-14 M',
        additional_info: 'Relief bagian dari kompleks candi Majapahit'
      }
    },
    cultural_analysis: {
      origin_region: 'Kerajaan Majapahit, Jawa Timur',
      historical_period: 'Abad ke-14 M, Masa Kejayaan Majapahit',
      traditional_use: 'Media edukasi dan dokumentasi cerita keagamaan',
      artistic_elements: ['Teknik ukir rendah', 'Komposisi naratif', 'Ornamen tradisional Jawa'],
    },
    educational_content: {
      fun_facts: [
        'Relief ini menggambarkan kehidupan istana Majapahit',
        'Teknik ukir yang digunakan mencerminkan kemahiran seniman Jawa',
        'Setiap detail relief memiliki makna simbolis yang mendalam'
      ],
      related_culture: 'Seni relief candi Indonesia yang terpengaruh budaya Hindu-Buddha',
      modern_relevance: 'Inspirasi untuk seni ukir dan arsitektur modern Indonesia'
    }
  }
  // Add more analysis data as needed...
};

// GET /library - Get all library items (for the main library page)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category, limit = 20, offset = 0 } = req.query;
    
    let items = Object.values(scriptureDatabase).map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.pages[0]?.imageUrl || '', // Use first page as thumbnail
      pageCount: item.pages.length
    }));

    // Apply search filter
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (category) {
      items = items.filter(item => item.category === category);
    }

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const limitNum = parseInt(limit as string);
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: {
        items: paginatedItems,
        total: items.length,
        hasMore: startIndex + limitNum < items.length
      }
    });

  } catch (error) {
    console.error('Library fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch library items'
    });
  }
});

// GET /library/:id - Get specific scripture with all pages and analysis
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const scripture = scriptureDatabase[id];
    if (!scripture) {
      return res.status(404).json({
        success: false,
        error: 'Scripture not found'
      });
    }

    // Attach analysis data to each page
    const pagesWithAnalysis = scripture.pages.map(page => ({
      ...page,
      analysis: analysisDatabase[page.analysisId] || null
    }));

    const response = {
      ...scripture,
      pages: pagesWithAnalysis
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Scripture detail fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scripture details'
    });
  }
});

// GET /library/:id/page/:pageId - Get specific page analysis (for performance optimization)
router.get("/:id/page/:pageId", async (req: Request, res: Response) => {
  try {
    const { id, pageId } = req.params;
    
    const scripture = scriptureDatabase[id];
    if (!scripture) {
      return res.status(404).json({
        success: false,
        error: 'Scripture not found'
      });
    }

    const page = scripture.pages.find(p => p.id === pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    const analysis = analysisDatabase[page.analysisId];
    
    res.json({
      success: true,
      data: {
        ...page,
        analysis: analysis || null
      }
    });

  } catch (error) {
    console.error('Page detail fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page details'
    });
  }
});

// POST /library/:id/analyze-page - Re-analyze a specific page (connect to your scan agent)
router.post("/:id/analyze-page/:pageId", async (req: Request, res: Response) => {
  try {
    const { id, pageId } = req.params;
    
    const scripture = scriptureDatabase[id];
    if (!scripture) {
      return res.status(404).json({
        success: false,
        error: 'Scripture not found'
      });
    }

    const page = scripture.pages.find(p => p.id === pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    // TODO: Integrate with your scanAgent to re-analyze the image
    // const analysisResult = await analyzeImage(page.imageUrl);
    
    // For now, return existing analysis
    const analysis = analysisDatabase[page.analysisId];
    
    res.json({
      success: true,
      data: {
        ...page,
        analysis: analysis || null
      },
      message: 'Page analysis completed'
    });

  } catch (error) {
    console.error('Page analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze page'
    });
  }
});

export default router;
