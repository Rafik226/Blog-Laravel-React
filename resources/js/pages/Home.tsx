import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AppLayout from '@/layouts/app-layout';
import PostCard from '@/components/blog/PostCard';
import CategoryCard from '@/components/blog/CategoryCard';
import FeaturedArticle from '@/components/blog/FeaturedArticle';
import { Post, Category } from '@/types';

interface HomeProps {
  recentPosts: Post[];
  featuredPosts: Post[];
  popularCategories: Category[];
  popularTags: { id: number; name: string; slug: string; posts_count: number }[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Component for animated section
const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className={className}
      style={{ originY: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
};

export default function Home({ recentPosts, featuredPosts, popularCategories, popularTags }: HomeProps) {
  return (
    <AppLayout showSidebar={false}>
      <Head title="Accueil" />
      
      {/* Hero Section with animation */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <motion.div 
            className="flex flex-col md:flex-row gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Bienvenue sur notre blog
              </motion.h1>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Découvrez les derniers articles, tutoriels, astuces et actualités tech.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <input 
                  type="email" 
                  placeholder="Entrez votre email" 
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-white dark:bg-primary dark:text-white px-6 py-3 rounded-md hover:bg-primary/90 dark:hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  S'abonner
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.img 
                src="/images/blog-hero.svg" 
                alt="Blog Illustration" 
                className="w-full h-auto max-h-72 md:max-h-80 max-w-lg mx-auto drop-shadow-xl"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        ></motion.div>
      </div>
      
      {/* Category Browser with animation */}
      <AnimatedSection className="py-12 bg-gray-50 dark:bg-gray-800" delay={0.2}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h2 
              className="text-2xl font-bold relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Parcourir les catégories</span>
              <motion.span 
                className="absolute bottom-0 left-0 h-2 bg-primary/20 dark:bg-primary/30 rounded-lg"
                style={{ width: '70%', zIndex: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              ></motion.span>
            </motion.h2>
            
            <motion.a 
              href={route('categories.index')}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>Voir toutes les catégories</span>
              <motion.svg 
                width="16" height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
              >
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.a>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {popularCategories.slice(0, 5).map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="h-full"
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Featured Articles with animation */}
      <AnimatedSection className="py-12 bg-white dark:bg-gray-900" delay={0.4}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h2 
              className="text-2xl font-bold relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Articles à la une</span>
              <motion.span 
                className="absolute bottom-0 left-0 h-2 bg-primary/20 dark:bg-primary/30 rounded-lg"
                style={{ width: '70%', zIndex: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              ></motion.span>
            </motion.h2>
            
            <motion.a 
              href={route('posts.index')}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>Voir tous les articles</span>
              <motion.svg 
                width="16" height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
              >
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.a>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredPosts.slice(0, 4).map((post, index) => (
              <motion.div 
                key={post.id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="h-full"
              >
                <FeaturedArticle post={post} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Recent Posts with animation */}
      <AnimatedSection className="py-12 bg-gray-50 dark:bg-gray-800" delay={0.6}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h2 
              className="text-2xl font-bold relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Articles récents</span>
              <motion.span 
                className="absolute bottom-0 left-0 h-2 bg-primary/20 dark:bg-primary/30 rounded-lg"
                style={{ width: '70%', zIndex: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              ></motion.span>
            </motion.h2>
            
            <motion.a 
              href={route('posts.index')}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>Voir tous les articles</span>
              <motion.svg 
                width="16" height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                initial={{ x: 0 }}
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
              >
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.a>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recentPosts.slice(0, 4).map((post, index) => (
              <motion.div 
                key={post.id} 
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", 
                  transition: { duration: 0.3 }
                }}
                className="h-full"
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Tags Cloud with animation */}
      <AnimatedSection className="py-12 bg-white dark:bg-gray-900" delay={0.8}>
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl font-bold mb-8 relative inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative z-10">Tags populaires</span>
            <motion.span 
              className="absolute bottom-0 left-0 h-2 bg-primary/20 dark:bg-primary/30 rounded-lg"
              style={{ width: '70%', zIndex: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.span>
          </motion.h2>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {popularTags.slice(0, 10).map((tag, index) => (
              <motion.a 
                key={tag.id}
                href={route('tags.show', tag.slug)}
                className="px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-primary hover:text-white transition-colors shadow-sm"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "var(--primary)",
                  color: "white"
                }}
                whileTap={{ scale: 0.98 }}
                custom={index}
              >
                {tag.name} ({tag.posts_count})
              </motion.a>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Newsletter Section */}
      <AnimatedSection className="relative py-16 overflow-hidden bg-gray-50 dark:bg-gray-800" delay={1}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Restez informé</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles et mises à jour directement dans votre boîte de réception.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors shadow-md"
              >
                S'abonner
              </motion.button>
            </motion.div>
            
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              En vous inscrivant, vous acceptez notre politique de confidentialité.
              Nous ne partagerons jamais votre adresse e-mail.
            </motion.p>
          </motion.div>
        </div>
      </AnimatedSection>
    </AppLayout>
  );
}