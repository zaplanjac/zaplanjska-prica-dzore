import React, { useState } from 'react';
import { BookOpen, Calendar, Code, Users, Palette, Database, Shield, Smartphone, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryStep {
  id: number;
  title: string;
  date: string;
  description: string;
  details: string[];
  icon: React.ComponentType<any>;
  color: string;
  category: 'design' | 'functionality' | 'content' | 'optimization';
}

export const DevelopmentHistory: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const developmentSteps: HistoryStep[] = [
    {
      id: 1,
      title: "Иницијални концепт и дизајн",
      date: "Почетак развоја",
      description: "Креирање основне структуре блог платформе са фокусом на читљивост и елегантан дизајн.",
      details: [
        "Постављање Vite + React + TypeScript темплејта",
        "Конфигурација Tailwind CSS-а за стилизовање",
        "Дизајн основне структуре компоненти",
        "Креирање типова за блог постове",
        "Имплементација основне навигације"
      ],
      icon: Palette,
      color: "bg-purple-500",
      category: "design"
    },
    {
      id: 2,
      title: "Основне компоненте и навигација",
      date: "Фаза 1",
      description: "Развој кључних компоненти за приказ садржаја и навигацију кроз сајт.",
      details: [
        "Header компонента са логом и навигацијом",
        "Homepage са приказом постова",
        "BlogPost компонента за детаљан приказ",
        "Responsive дизајн за мобилне уређаје",
        "Smooth scroll и Back to Top функционалност"
      ],
      icon: Code,
      color: "bg-blue-500",
      category: "functionality"
    },
    {
      id: 3,
      title: "Мобилна оптимизација",
      date: "Фаза 2",
      description: "Побољшање корисничког искуства на мобилним уређајима.",
      details: [
        "MobileMenu компонента са slide-in анимацијом",
        "Responsive grid системи",
        "Touch-friendly интерфејс елементи",
        "Оптимизација за различите величине екрана",
        "Тестирање на мобилним уређајима"
      ],
      icon: Smartphone,
      color: "bg-green-500",
      category: "optimization"
    },
    {
      id: 4,
      title: "Категорије и филтрирање",
      date: "Фаза 3",
      description: "Додавање система категорија за боље организовање садржаја.",
      details: [
        "CategoryDropdown компонента",
        "Филтрирање постова по категоријама",
        "Визуелни индикатори за категорије",
        "Интеграција са мобилним менијем",
        "Анимације за dropdown меније"
      ],
      icon: Database,
      color: "bg-amber-500",
      category: "functionality"
    },
    {
      id: 5,
      title: "Админ панел и управљање садржајем",
      date: "Фаза 4",
      description: "Креирање административног интерфејса за управљање постовима.",
      details: [
        "AdminLogin компонента са аутентификацијом",
        "AdminPanel за CRUD операције",
        "Форма за креирање и уређивање постова",
        "Превиу функционалност",
        "Валидација и error handling"
      ],
      icon: Shield,
      color: "bg-red-500",
      category: "functionality"
    },
    {
      id: 6,
      title: "Аутор систем",
      date: "Фаза 5",
      description: "Имплементација система за ауторе са могућношћу пријаве и управљања садржајем.",
      details: [
        "AuthorLogin и AuthorPanel компоненте",
        "Систем аутентификације за ауторе",
        "Профил страница за ауторе",
        "Статистике и аналитика",
        "Филтрирање постова по аутору"
      ],
      icon: Users,
      color: "bg-indigo-500",
      category: "functionality"
    },
    {
      id: 7,
      title: "Authors страница",
      date: "Фаза 6",
      description: "Креирање посебне странице за приказ свих аутора са њиховим статистикама.",
      details: [
        "Authors компонента са grid приказом",
        "Претрага и филтрирање аутора",
        "Статистике за сваког аутора",
        "Сортирање по различитим критеријумима",
        "Интеграција са навигацијом"
      ],
      icon: Users,
      color: "bg-teal-500",
      category: "content"
    },
    {
      id: 8,
      title: "Регистрација аутора",
      date: "Фаза 7",
      description: "Додавање система за регистрацију нових аутора са валидацијом.",
      details: [
        "AuthorRegistration компонента",
        "Мулти-степ форма за регистрацију",
        "Валидација email адресе и лозинке",
        "Success страница са инструкцијама",
        "Интеграција са постојећим auth системом"
      ],
      icon: Users,
      color: "bg-pink-500",
      category: "functionality"
    },
    {
      id: 9,
      title: "Историја развоја",
      date: "Тренутно",
      description: "Креирање ове странице која документује цео процес развоја апликације.",
      details: [
        "DevelopmentHistory компонента",
        "Timeline приказ развоја",
        "Детаљан опис сваке фазе",
        "Категоризација по типу промена",
        "Интерактивни интерфејс са проширивим секцијама"
      ],
      icon: BookOpen,
      color: "bg-gray-500",
      category: "content"
    }
  ];

  const categories = [
    { value: 'all', label: 'Све категорије', color: 'bg-gray-100' },
    { value: 'design', label: 'Дизајн', color: 'bg-purple-100' },
    { value: 'functionality', label: 'Функционалност', color: 'bg-blue-100' },
    { value: 'content', label: 'Садржај', color: 'bg-green-100' },
    { value: 'optimization', label: 'Оптимизација', color: 'bg-amber-100' }
  ];

  const filteredSteps = selectedCategory === 'all' 
    ? developmentSteps 
    : developmentSteps.filter(step => step.category === selectedCategory);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Историја развоја
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Детаљан преглед како је настао сајт "Читај о Заплању" - корак по корак кроз цео процес развоја.
        </p>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Филтрирај по категорији:</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-amber-600 text-white shadow-md'
                    : `${category.color} text-gray-700 hover:shadow-md`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section>
        <div className="space-y-6">
          {filteredSteps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Step Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      categories.find(c => c.value === step.category)?.color
                    } text-gray-700`}>
                      {categories.find(c => c.value === step.category)?.label}
                    </span>
                    {expandedStep === step.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Details */}
              <div className={`overflow-hidden transition-all duration-300 ${
                expandedStep === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3 mt-4">Детаљи имплементације:</h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-3">
                        <ArrowRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="mt-16">
        <div className="bg-gradient-to-r from-amber-50 to-cream-100 rounded-2xl p-8">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center">
            Резиме развоја
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{developmentSteps.length}</div>
              <div className="text-gray-600">Фаза развоја</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {developmentSteps.reduce((acc, step) => acc + step.details.length, 0)}
              </div>
              <div className="text-gray-600">Имплементираних функција</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-gray-600">Категорије промена</div>
            </div>
          </div>
          <p className="text-gray-700 text-center leading-relaxed">
            Овај сајт је развијан итеративно, са фокусом на корисничко искуство, 
            функционалност и визуелну привлачност. Свака фаза је донела нове могућности 
            и побољшања која чине платформу комплетнијом и кориснијом.
          </p>
        </div>
      </section>
    </div>
  );
};