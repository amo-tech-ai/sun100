export interface DeckTemplate {
  slide: string;
  title: string;
  content: string;
  bullet: string;
  imageContainer?: string;
  image?: string;
}

interface Templates {
  [key: string]: DeckTemplate;
}

export const templates: Templates = {
  default: {
    slide: 'bg-white p-12 flex flex-col justify-center text-center items-center font-sans text-gray-800',
    title: 'text-5xl font-bold mb-6 text-slate-900',
    content: 'text-2xl text-slate-700 list-none p-0 space-y-4',
    bullet: '',
    imageContainer: 'w-full h-1/2 mb-4',
    image: 'w-full h-full object-contain',
  },
  professional: {
    slide: 'bg-slate-800 p-12 flex flex-col justify-start text-left items-start font-serif text-white',
    title: 'text-4xl font-semibold mb-8 border-b-2 border-[#E87C4D] pb-2',
    content: 'text-xl list-disc pl-8 space-y-3',
    bullet: '',
    imageContainer: 'w-full h-1/3 mb-6',
    image: 'w-full h-full object-cover rounded-lg',
  }
};
