export interface DeckTemplate {
  slide: string;
  title: string;
  content: string;
  bullet: string;
  imageContainer?: string;
  image?: string;
  textContainer?: string;
}

interface Templates {
  [key: string]: DeckTemplate;
}

export const templates: Templates = {
  default: {
    slide: 'bg-white p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 font-manrope text-gray-800',
    imageContainer: 'w-full md:w-2/5 h-auto md:h-full flex-shrink-0',
    image: 'w-full h-full object-cover rounded-xl shadow-md',
    textContainer: 'flex-1 flex flex-col justify-center text-left',
    title: 'text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-900 leading-tight',
    content: 'text-base sm:text-lg md:text-xl text-slate-600 list-none p-0 space-y-2 sm:space-y-3',
    bullet: '',
  },
  professional: {
    slide: 'bg-slate-800 p-6 sm:p-8 md:p-12 flex flex-col justify-start text-left items-start font-serif text-white',
    title: 'text-xl sm:text-2xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 border-b-2 border-[#E87C4D] pb-2',
    content: 'text-base sm:text-lg md:text-xl list-disc pl-4 sm:pl-6 md:pl-8 space-y-2 sm:space-y-3',
    bullet: '',
    imageContainer: 'w-full h-1/4 sm:h-1/3 mb-4 sm:mb-6',
    image: 'w-full h-full object-cover rounded-lg',
    textContainer: 'w-full',
  },
  minimalist: {
    slide: 'bg-white p-6 sm:p-10 md:p-16 flex flex-col items-center justify-center text-center font-manrope',
    imageContainer: 'w-full h-1/3 sm:h-1/2 mb-4 sm:mb-6 md:mb-8',
    image: 'w-full h-full object-contain',
    textContainer: 'w-full max-w-3xl',
    title: 'text-2xl sm:text-3xl md:text-5xl font-extrabold mb-2 sm:mb-3 md:mb-4 text-gray-900 tracking-tight leading-tight',
    content: 'text-base sm:text-lg md:text-xl text-gray-500 list-none p-0 space-y-1 sm:space-y-2',
    bullet: '',
  },
  startup: {
    slide: 'bg-gray-900 p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 font-manrope text-white',
    imageContainer: 'w-full md:w-1/2 h-auto md:h-full',
    image: 'w-full h-full object-cover rounded-xl shadow-lg shadow-brand-orange/20',
    textContainer: 'w-full md:w-1/2',
    title: 'text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-white leading-tight',
    content: 'text-base sm:text-lg md:text-xl text-gray-300 list-disc pl-4 sm:pl-5 md:pl-6 space-y-2 sm:space-y-3',
    bullet: 'text-brand-orange',
  },
  vibrantCover: {
    slide: 'bg-white p-6 sm:p-8 md:p-12 flex flex-col items-start justify-center text-left relative overflow-hidden',
    title: 'text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-heading-text !leading-tight tracking-tighter',
    content: 'text-base sm:text-lg md:text-xl text-body-text mt-2 sm:mt-3 md:mt-4 max-w-xl',
    bullet: '',
  },
  vibrantVision: {
    slide: 'bg-white p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center',
    title: 'text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-heading-text mb-2 sm:mb-3 md:mb-4 leading-tight',
    content: 'text-base sm:text-lg text-body-text',
    bullet: '',
  },
  vibrantProblem: {
    slide: 'bg-white p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center',
    imageContainer: 'w-full h-full rounded-lg overflow-hidden',
    image: 'w-full h-full object-cover',
    textContainer: 'flex flex-col justify-center',
    title: 'text-xl sm:text-2xl md:text-4xl font-bold text-heading-text mb-3 sm:mb-4 md:mb-6 leading-tight',
    content: 'text-base sm:text-lg md:text-xl text-body-text space-y-2 sm:space-y-3 md:space-y-4 list-disc pl-4 sm:pl-5 md:pl-6',
    bullet: 'text-vibrant-purple',
  },
  vibrantSolutions: {
    slide: 'bg-white p-6 sm:p-8 md:p-12 text-center',
    title: 'text-xl sm:text-2xl md:text-4xl font-bold text-heading-text mb-2 sm:mb-3 md:mb-4 leading-tight',
    content: 'text-base sm:text-lg text-body-text max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-12',
    bullet: '',
  },
  vibrantTimeline: {
    slide: 'bg-vibrant-purple p-6 sm:p-8 md:p-12 text-white',
    title: 'text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 leading-tight',
    content: 'list-none p-0',
    bullet: '',
  }
};