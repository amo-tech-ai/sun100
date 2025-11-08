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
    slide: 'bg-white p-16 flex flex-row items-center justify-center gap-12 font-sans text-gray-800',
    imageContainer: 'w-2/5 h-full flex-shrink-0',
    image: 'w-full h-full object-cover rounded-xl shadow-md',
    textContainer: 'flex-1 flex flex-col justify-center text-left',
    title: 'text-4xl font-bold mb-4 text-slate-900',
    content: 'text-xl text-slate-600 list-none p-0 space-y-3',
    bullet: '',
  },
  professional: {
    slide: 'bg-slate-800 p-12 flex flex-col justify-start text-left items-start font-serif text-white',
    title: 'text-4xl font-semibold mb-8 border-b-2 border-[#E87C4D] pb-2',
    content: 'text-xl list-disc pl-8 space-y-3',
    bullet: '',
    imageContainer: 'w-full h-1/3 mb-6',
    image: 'w-full h-full object-cover rounded-lg',
    textContainer: 'w-full',
  }
};