// Translation dictionary for common terms
const translations: Record<string, string> = {
  'Readwell': 'Читај о Заплању',
  'Stories': 'Приче',
  'Authors': 'Аутори',
  'Categories': 'Категорије',
  'About': 'О нама',
  'Stories Worth': 'Приче вредне',
  'Reading': 'читања',
  'Discover thoughtful articles, deep insights, and beautiful narratives crafted for the modern reader.': 'Откријте промишљене чланке, дубоке увиде и прелепе приче створене за савременог читаоца.',
  'Featured Story': 'Истакнута прича',
  'Latest Story': 'Најновија прича',
  'Recent Stories': 'Недавне приче',
  'More in': 'Више у категорији',
  'Back to Stories': 'Назад на приче',
  'min read': 'мин читања',
  'Technology': 'Технологија',
  'Culture': 'Култура',
  'Environment': 'Природа',
  'Science': 'Наука',
  'Philosophy': 'Филозофија'
};

// Simple translation function
export const t = (key: string): string => {
  return translations[key] || key;
};

// Latin to Cyrillic conversion map
const latinToCyrillicMap: Record<string, string> = {
  'a': 'а', 'b': 'б', 'c': 'ц', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г', 'h': 'х',
  'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п',
  'q': 'к', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'v': 'в', 'w': 'в', 'x': 'кс',
  'y': 'ј', 'z': 'з',
  'A': 'А', 'B': 'Б', 'C': 'Ц', 'D': 'Д', 'E': 'Е', 'F': 'Ф', 'G': 'Г', 'H': 'Х',
  'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'П',
  'Q': 'К', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У', 'V': 'В', 'W': 'В', 'X': 'КС',
  'Y': 'Ј', 'Z': 'З',
  // Special combinations
  'dj': 'ђ', 'Dj': 'Ђ', 'DJ': 'Ђ',
  'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
  'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
  'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
  'ch': 'ч', 'Ch': 'Ч', 'CH': 'Ч',
  'sh': 'ш', 'Sh': 'Ш', 'SH': 'Ш',
  'zh': 'ж', 'Zh': 'Ж', 'ZH': 'Ж',
  'ć': 'ћ', 'Ć': 'Ћ',
  'č': 'ч', 'Č': 'Ч',
  'đ': 'ђ', 'Đ': 'Ђ',
  'š': 'ш', 'Š': 'Ш',
  'ž': 'ж', 'Ž': 'Ж'
};

// Convert Latin text to Cyrillic
export const latinToCyrillic = (text: string): string => {
  // If text is already in Cyrillic, return as is
  if (/[а-яё]/i.test(text)) {
    return text;
  }
  
  let result = text;
  
  // First handle special combinations
  const specialCombinations = ['dj', 'Dj', 'DJ', 'dž', 'Dž', 'DŽ', 'lj', 'Lj', 'LJ', 'nj', 'Nj', 'NJ', 'ch', 'Ch', 'CH', 'sh', 'Sh', 'SH', 'zh', 'Zh', 'ZH'];
  
  for (const combo of specialCombinations) {
    const regex = new RegExp(combo, 'g');
    result = result.replace(regex, latinToCyrillicMap[combo] || combo);
  }
  
  // Then handle individual characters
  for (const [latin, cyrillic] of Object.entries(latinToCyrillicMap)) {
    if (latin.length === 1) {
      const regex = new RegExp(latin, 'g');
      result = result.replace(regex, cyrillic);
    }
  }
  
  return result;
};

// Format Serbian date
export const formatSerbianDate = (dateString: string): string => {
  // If already formatted in Serbian, return as is
  if (dateString.includes('год')) {
    return dateString;
  }
  
  // Try to parse and format the date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return original if can't parse
  }
  
  const serbianMonths = [
    'јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
    'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'
  ];
  
  return `${date.getDate()} ${serbianMonths[date.getMonth()]} ${date.getFullYear()} год`;
};