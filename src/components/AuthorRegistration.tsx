import React, { useState } from 'react';
import { BookOpen, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  agreeToTerms: boolean;
}

export const AuthorRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    agreeToTerms: false
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Име је обавезно';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Презиме је обавезно';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email је обавезан';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Унесите валидну email адресу';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Лозинка је обавезна';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Лозинка мора имати најмање 6 карактера';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Потврдите лозинку';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Лозинке се не подударају';
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'Морате се сложити са условима коришћења';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Успешна регистрација!
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Добродошли у заједницу аутора "Читај о Заплању"! Ваш налог је креиран и можете почети да пишете ваше приче.
            </p>
            
            <div className="space-y-4">
              <a
                href="/author/login"
                className="block w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
              >
                Пријавите се сада
              </a>
              
              <a
                href="/"
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Назад на почетну
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-100 flex items-center justify-center px-6 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <a href="/" className="flex items-center space-x-2 group">
              <BookOpen className="w-8 h-8 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />
              <h1 className="text-3xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-200">
                Читај о Заплању
              </h1>
            </a>
          </div>
          <h2 className="text-xl text-gray-600">Регистрација за ауторе</h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Корак {currentStep} од 3</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Основне информације</h3>
                <p className="text-gray-600">Унесите ваше основне податке</p>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Име *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Ваше име"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Презиме *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Ваше презиме"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email адреса *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="vase.ime@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Security */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Безбедност налога</h3>
                <p className="text-gray-600">Креирајте сигурну лозинку за ваш налог</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Лозинка *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Унесите лозинку"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Потврдите лозинку *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Поновите лозинку"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Савети за сигурну лозинку:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Најмање 6 карактера</li>
                        <li>Комбинација слова, бројева и симбола</li>
                        <li>Избегавајте лако погодљиве информације</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bio and Terms */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Завршетак регистрације</h3>
                <p className="text-gray-600">Додајте кратак опис о себи и прихватите услове</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    О вама (опционо)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Напишите нешто о себи, вашим интересовањима и зашто желите да пишете за 'Читај о Заплању'..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/500 карактера
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Преглед ваших података:</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Име:</span> {formData.firstName} {formData.lastName}</div>
                    <div><span className="font-medium">Email:</span> {formData.email}</div>
                    <div><span className="font-medium">Лозинка:</span> ••••••••</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                      className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                      Слажем се са <a href="#" className="text-amber-600 hover:text-amber-700 underline">условима коришћења</a> и 
                      <a href="#" className="text-amber-600 hover:text-amber-700 underline ml-1">политиком приватности</a>. 
                      Разумем да ће мој садржај бити јавно доступан на платформи.
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Назад
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
              >
                <span>Даље</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Регистрација...' : 'Завршите регистрацију'}
              </button>
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Већ имате налог?{' '}
            <a href="/author/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Пријавите се овде
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};