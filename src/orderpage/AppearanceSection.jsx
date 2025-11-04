// components/Settings/AppearanceSection.jsx
import { motion } from 'framer-motion';
import { FaPalette, FaSun, FaMoon, FaSave } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const AppearanceSection = () => {
  const { theme, language, fontSize, updateTheme, updateLanguage, updateFontSize } = useTheme();
  const [loading, setLoading] = useState(false);
  const [appearance, setAppearance] = useState({
    theme: theme,
    language: language,
    fontSize: fontSize
  });

  // Sync with context when props change
  useEffect(() => {
    setAppearance({
      theme: theme,
      language: language,
      fontSize: fontSize
    });
  }, [theme, language, fontSize]);

  const handleAppearanceUpdate = async () => {
    setLoading(true);
    
    try {
      // Update context which will automatically save to localStorage
      updateTheme(appearance.theme);
      updateLanguage(appearance.language);
      updateFontSize(appearance.fontSize);
      
      // Simulate API call if needed
      // await updateUserAppearance(appearance);
      
      setTimeout(() => {
        setLoading(false);
        // Show success message
        alert('Appearance settings updated successfully!');
      }, 1000);
      
    } catch (error) {
      console.error('Error updating appearance:', error);
      setLoading(false);
      alert('Failed to update appearance settings.');
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      key="appearance" 
      variants={tabContentVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
      className="bg-secondary rounded-2xl shadow-custom border border-color p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
        <FaPalette className="accent-color" /> 
        Appearance Settings
      </h2>

      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              id: "light", 
              label: "Light", 
              icon: <FaSun className="text-yellow-500 text-xl" />, 
              description: "Clean and bright interface" 
            },
            { 
              id: "dark", 
              label: "Dark", 
              icon: <FaMoon className="text-indigo-400 text-xl" />, 
              description: "Easy on the eyes in low light" 
            }
          ].map((themeOption) => (
            <motion.label
              key={themeOption.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                appearance.theme === themeOption.id 
                  ? 'border-accent bg-accent bg-opacity-10' 
                  : 'border-color hover:border-accent hover:border-opacity-50'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={themeOption.id}
                checked={appearance.theme === themeOption.id}
                onChange={(e) => setAppearance(prev => ({ ...prev, theme: e.target.value }))}
                className="sr-only"
              />
              {themeOption.icon}
              <div>
                <span className="font-semibold text-primary block">{themeOption.label}</span>
                <span className="text-sm text-secondary">{themeOption.description}</span>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-4">Language</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "en", label: "English", flag: "🇺🇸", native: "English" },
            { id: "bn", label: "Bengali", flag: "🇧🇩", native: "বাংলা" },
            { id: "es", label: "Spanish", flag: "🇪🇸", native: "Español" },
            { id: "fr", label: "French", flag: "🇫🇷", native: "Français" },
            { id: "de", label: "German", flag: "🇩🇪", native: "Deutsch" },
            { id: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" }
          ].map((lang) => (
            <motion.label
              key={lang.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                appearance.language === lang.id 
                  ? 'border-accent bg-accent bg-opacity-10' 
                  : 'border-color hover:border-accent hover:border-opacity-50'
              }`}
            >
              <input
                type="radio"
                name="language"
                value={lang.id}
                checked={appearance.language === lang.id}
                onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                className="sr-only"
              />
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-semibold text-primary">{lang.label}</span>
                <span className="text-xs text-secondary">{lang.native}</span>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary mb-4">Font Size</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "small", label: "Small", description: "Compact view" },
            { id: "medium", label: "Medium", description: "Default size" },
            { id: "large", label: "Large", description: "Enhanced readability" }
          ].map((size) => (
            <motion.label
              key={size.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                appearance.fontSize === size.id 
                  ? 'border-accent bg-accent bg-opacity-10' 
                  : 'border-color hover:border-accent hover:border-opacity-50'
              }`}
            >
              <input
                type="radio"
                name="fontSize"
                value={size.id}
                checked={appearance.fontSize === size.id}
                onChange={(e) => setAppearance(prev => ({ ...prev, fontSize: e.target.value }))}
                className="sr-only"
              />
              <div className={`font-semibold text-primary mb-1 ${
                size.id === 'small' ? 'text-base' : 
                size.id === 'medium' ? 'text-lg' : 'text-xl'
              }`}>
                Aa
              </div>
              <span className="font-semibold text-primary text-center">{size.label}</span>
              <span className="text-xs text-secondary text-center mt-1">{size.description}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleAppearanceUpdate}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 bg-accent hover:bg-accent-hover disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Updating...
          </>
        ) : (
          <>
            <FaSave className="text-lg" /> 
            Save Appearance Settings
          </>
        )}
      </motion.button>

      {/* Preview Note */}
      <div className="mt-4 p-3 bg-tertiary rounded-lg">
        <p className="text-sm text-secondary text-center">
          💡 Changes will be applied immediately after saving
        </p>
      </div>
    </motion.div>
  );
};

export default AppearanceSection;