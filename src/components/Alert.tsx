import { ReactNode, useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Info, AlertTriangle, X, 
  Sparkles, Zap, Shield, Bell, TrendingUp, Target,
  AlertCircle, Clock, Star, Loader2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning' | 'premium';
  message: string | ReactNode;
  title?: string;
  onClose?: () => void;
  duration?: number;
  animated?: boolean;
  showIcon?: boolean;
  showClose?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  variant?: 'default' | 'solid' | 'outline' | 'gradient';
  showProgress?: boolean;
}

const Alert = ({ 
  type, 
  message, 
  title,
  onClose, 
  duration = 5000,
  animated = true,
  showIcon = true,
  showClose = true,
  action,
  variant = 'default',
  showProgress = true
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const icons = {
    success: { icon: CheckCircle, color: 'text-green-500' },
    error: { icon: XCircle, color: 'text-red-500' },
    info: { icon: Info, color: 'text-blue-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    premium: { icon: Sparkles, color: 'text-purple-500' },
  };

  const variantStyles = {
    default: {
      success: 'bg-green-50 text-green-800 border-green-200',
      error: 'bg-red-50 text-red-800 border-red-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      premium: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border-purple-200',
    },
    solid: {
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600',
      error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-600',
      info: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-600',
      warning: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-yellow-600',
      premium: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600',
    },
    outline: {
      success: 'bg-transparent text-green-700 border-2 border-green-400',
      error: 'bg-transparent text-red-700 border-2 border-red-400',
      info: 'bg-transparent text-blue-700 border-2 border-blue-400',
      warning: 'bg-transparent text-yellow-700 border-2 border-yellow-400',
      premium: 'bg-transparent text-purple-700 border-2 border-purple-400',
    },
    gradient: {
      success: 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 text-green-800 border-green-300 shadow-lg',
      error: 'bg-gradient-to-r from-red-50 via-rose-50 to-red-100 text-red-800 border-red-300 shadow-lg',
      info: 'bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100 text-blue-800 border-blue-300 shadow-lg',
      warning: 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-100 text-yellow-800 border-yellow-300 shadow-lg',
      premium: 'bg-gradient-to-r from-purple-50 via-pink-50 to-fuchsia-100 text-purple-800 border-purple-300 shadow-lg',
    },
  };

  const IconComponent = icons[type].icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
        setIsVisible(false);
      }, duration);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const decrement = 100 / (duration / 100);
          return Math.max(0, prev - decrement);
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, onClose]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={animated ? { opacity: 0, y: -20, scale: 0.95 } : false}
          animate={animated ? { opacity: 1, y: 0, scale: 1 } : false}
          exit={animated ? { opacity: 0, y: -20, scale: 0.95 } : false}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.3 
          }}
          whileHover={{ 
            scale: animated ? 1.02 : 1,
            transition: { duration: 0.2 }
          }}
          className={`relative rounded-2xl border ${variantStyles[variant][type]} overflow-hidden group`}
        >
          {/* Effet de brillance */}
          {variant !== 'solid' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%]"
              animate={{
                translateX: ["-200%", "200%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          )}

          {/* Effet de particules pour premium */}
          {type === 'premium' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${10 + i * 25}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </>
          )}

          <div className="p-5">
            <div className="flex items-start">
              {showIcon && (
                <motion.div
                  initial={animated ? { scale: 0, rotate: -180 } : false}
                  animate={animated ? { scale: 1, rotate: 0 } : false}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    delay: 0.1 
                  }}
                  className="relative flex-shrink-0"
                >
                  <div className={`p-3 rounded-xl ${
                    variant === 'solid' 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : type === 'premium'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : icons[type].color.replace('text-', 'bg-') + '/20'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      variant === 'solid' ? 'text-white' : icons[type].color
                    }`} />
                  </div>
                  
                  {/* Anneau externe animé */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-white/30"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </motion.div>
              )}

              <div className="flex-1 ml-4">
                {title && (
                  <motion.h3
                    initial={animated ? { opacity: 0, x: -10 } : false}
                    animate={animated ? { opacity: 1, x: 0 } : false}
                    transition={{ delay: 0.15 }}
                    className="text-lg font-bold mb-1"
                  >
                    {title}
                  </motion.h3>
                )}
                
                <motion.div
                  initial={animated ? { opacity: 0, x: -10 } : false}
                  animate={animated ? { opacity: 1, x: 0 } : false}
                  transition={{ delay: 0.2 }}
                  className="text-sm md:text-base"
                >
                  {message}
                </motion.div>

                {action && (
                  <motion.button
                    initial={animated ? { opacity: 0, y: 10 } : false}
                    animate={animated ? { opacity: 1, y: 0 } : false}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      variant === 'solid'
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : type === 'premium'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                          : `bg-${icons[type].color.split('-')[1]}-500 hover:bg-${icons[type].color.split('-')[1]}-600 text-white`
                    }`}
                  >
                    {action.icon || <ChevronRight className="h-4 w-4" />}
                    {action.label}
                  </motion.button>
                )}
              </div>

              {showClose && onClose && (
                <motion.button
                  initial={animated ? { scale: 0 } : false}
                  animate={animated ? { scale: 1 } : false}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className={`ml-4 p-2 rounded-xl transition-colors ${
                    variant === 'solid'
                      ? 'hover:bg-white/20 text-white/80 hover:text-white'
                      : type === 'premium'
                        ? 'hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                        : `hover:bg-${icons[type].color.split('-')[1]}-100 text-${icons[type].color.split('-')[1]}-600 hover:text-${icons[type].color.split('-')[1]}-700`
                  }`}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Barre de progression */}
          {duration > 0 && showProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
              <motion.div
                className={`h-full ${
                  variant === 'solid'
                    ? 'bg-white/40'
                    : type === 'premium'
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : `bg-${icons[type].color.split('-')[1]}-400`
                }`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}

          {/* Effet de brillance au survol */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              translateX: ['-100%', '100%'],
            }}
            transition={{
              duration: 0.8,
              times: [0, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;