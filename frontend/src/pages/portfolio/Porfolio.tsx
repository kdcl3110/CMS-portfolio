import React, { useState, useEffect } from 'react';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

interface EducationItem {
  title: string;
  school: string;
  period: string;
  description: string;
  icon: string;
}

interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  demoLink?: string;
  codeLink?: string;
}

interface BlogItem {
  title: string;
  date: string;
  description: string;
  icon: string;
  link?: string;
}

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const Portfolio: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadCV = () => {
    // Simulation du téléchargement
    alert('Fonctionnalité de téléchargement du CV - Ajoutez votre lien de CV ici !');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre message ! Je vous répondrai bientôt.');
    (e.target as HTMLFormElement).reset();
  };

  const experiences: ExperienceItem[] = [
    {
      title: "Développeur Frontend Senior",
      company: "TechCorp Inc.",
      period: "2022 - Présent",
      description: "Lead développeur frontend sur des projets d'envergure, encadrement d'équipe et mise en place de bonnes pratiques de développement.",
      tags: ["React", "TypeScript", "Next.js", "Team Lead"]
    },
    {
      title: "Développeur Frontend",
      company: "WebAgency Pro",
      period: "2020 - 2022",
      description: "Développement de sites web et applications pour divers clients, spécialisation dans les interfaces utilisateur modernes.",
      tags: ["Vue.js", "Sass", "Figma", "WordPress"]
    },
    {
      title: "Développeur Junior",
      company: "StartupTech",
      period: "2018 - 2020",
      description: "Premiers pas dans le développement web, apprentissage des fondamentaux et participation à des projets innovants.",
      tags: ["HTML/CSS", "JavaScript", "Bootstrap", "Git"]
    }
  ];

  const education: EducationItem[] = [
    {
      title: "Master en Informatique",
      school: "Université de Technologie",
      period: "2016 - 2018",
      description: "Spécialisation en développement web et technologies modernes. Projet de fin d'études sur les progressive web apps.",
      icon: "🎓"
    },
    {
      title: "Licence Informatique",
      school: "École Supérieure d'Informatique",
      period: "2013 - 2016",
      description: "Formation complète en informatique avec spécialisation en programmation web et bases de données.",
      icon: "📚"
    },
    {
      title: "Certifications",
      school: "Diverses plateformes",
      period: "2018 - Présent",
      description: "AWS Certified Developer, Google Analytics, React Developer Certification, UX Design Fundamentals.",
      icon: "🏆"
    },
    {
      title: "Formation Continue",
      school: "Auto-apprentissage",
      period: "En continu",
      description: "Veille technologique permanente, participation à des conférences et workshops pour rester à jour.",
      icon: "💡"
    }
  ];

  const projects: ProjectItem[] = [
    {
      title: "Application E-commerce",
      description: "Une plateforme e-commerce moderne avec panier d'achat, système de paiement et interface d'administration.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      icon: "🛒"
    },
    {
      title: "Dashboard Analytics",
      description: "Tableau de bord interactif pour visualiser des données en temps réel avec des graphiques dynamiques.",
      tags: ["Vue.js", "Chart.js", "API REST", "WebSocket"],
      icon: "📊"
    },
    {
      title: "Site Web Corporate",
      description: "Site web responsive pour une entreprise avec animations fluides et optimisation SEO.",
      tags: ["HTML5", "CSS3", "JavaScript", "GSAP"],
      icon: "🏢"
    },
    {
      title: "Application Mobile PWA",
      description: "Progressive Web App avec fonctionnalités offline et notifications push pour une meilleure expérience utilisateur.",
      tags: ["PWA", "Service Worker", "IndexedDB", "Push API"],
      icon: "📱"
    },
    {
      title: "Portfolio Créatif",
      description: "Portfolio interactif pour un artiste avec galerie photo, animations CSS et design responsive.",
      tags: ["CSS Grid", "Animations", "Lightbox", "Responsive"],
      icon: "🎨"
    },
    {
      title: "Jeu Web Interactif",
      description: "Jeu de puzzle développé en JavaScript vanilla avec système de scores et sauvegarde locale.",
      tags: ["Canvas API", "Local Storage", "Game Logic", "Audio API"],
      icon: "🎮"
    }
  ];

  const blogPosts: BlogItem[] = [
    {
      title: "Les tendances du développement frontend en 2025",
      date: "15 Mars 2025",
      description: "Découvrez les nouvelles technologies et frameworks qui façonnent l'avenir du développement frontend cette année.",
      icon: "📝"
    },
    {
      title: "Optimiser les performances de vos applications React",
      date: "8 Mars 2025",
      description: "Tips et techniques pour améliorer les performances de vos applications React et offrir une meilleure expérience utilisateur.",
      icon: "⚡"
    },
    {
      title: "CSS Grid vs Flexbox : Quand utiliser quoi ?",
      date: "1 Mars 2025",
      description: "Guide complet pour choisir entre CSS Grid et Flexbox selon vos besoins de layout et design.",
      icon: "🎨"
    },
    {
      title: "Mon setup de développement 2025",
      date: "22 Février 2025",
      description: "Découvrez les outils, extensions et configurations que j'utilise quotidiennement pour être plus productif.",
      icon: "🛠️"
    },
    {
      title: "Créer des PWA performantes en 2025",
      date: "15 Février 2025",
      description: "Guide pratique pour développer des Progressive Web Apps modernes avec les dernières API et bonnes pratiques.",
      icon: "📱"
    },
    {
      title: "Automatiser son workflow avec GitHub Actions",
      date: "8 Février 2025",
      description: "Comment mettre en place des workflows CI/CD efficaces pour vos projets frontend avec GitHub Actions.",
      icon: "🔧"
    }
  ];

  const services: ServiceItem[] = [
    {
      title: "Développement Web",
      description: "Création de sites web modernes et responsives avec les dernières technologies frontend.",
      icon: "💻",
      features: ["Sites web responsives", "Applications web interactives", "Optimisation des performances", "SEO et accessibilité"]
    },
    {
      title: "UI/UX Design",
      description: "Conception d'interfaces utilisateur intuitives et d'expériences utilisateur optimales.",
      icon: "🎨",
      features: ["Prototypage et wireframes", "Design systems", "Tests utilisateur", "Interface mobile-first"]
    },
    {
      title: "Consultation",
      description: "Conseils techniques et accompagnement pour vos projets de développement web.",
      icon: "💼",
      features: ["Audit de code", "Architecture technique", "Formation équipe", "Stratégie digitale"]
    }
  ];

  const skills = ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Node.js", "Figma", "Git"];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-white/95 backdrop-blur-md'
      } border-b border-gray-200/50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </div>
            <div className="hidden md:flex space-x-6">
              {['home', 'about', 'services', 'experience', 'education', 'projects', 'blog', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-700 hover:text-blue-600 transition-colors relative group font-medium capitalize"
                >
                  {section === 'home' ? 'Accueil' : 
                   section === 'about' ? 'À propos' :
                   section === 'services' ? 'Services' :
                   section === 'experience' ? 'Expérience' :
                   section === 'education' ? 'Formation' :
                   section === 'projects' ? 'Projets' :
                   section === 'blog' ? 'Blog' : 'Contact'}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-white rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="text-center text-white z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Bonjour, je suis <span className="text-pink-300">[Votre Nom]</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Développeur Frontend passionné par la création d'expériences web exceptionnelles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:transform hover:scale-105 border border-white/30"
            >
              Voir mes projets
            </button>
            <button
              onClick={downloadCV}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>📄</span>
              Télécharger mon CV
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              À propos de moi
            </h2>
            <p className="text-xl text-gray-600">Découvrez mon parcours et mes compétences</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-gray-200 rounded-2xl h-96 flex items-center justify-center shadow-xl">
                <span className="text-6xl">👨‍💻</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800">Développeur Frontend Créatif</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Avec plus de [X] années d'expérience dans le développement web, je me spécialise dans la création d'interfaces utilisateur modernes et intuitives. Ma passion pour le design et la technologie me pousse à créer des expériences web qui marquent les esprits.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                J'aime transformer des idées complexes en solutions simples et élégantes, en utilisant les dernières technologies et les meilleures pratiques du développement frontend.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mes Services
            </h2>
            <p className="text-xl text-gray-600">Comment je peux vous aider à réaliser vos projets</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mon Expérience
            </h2>
            <p className="text-xl text-gray-600">Mon parcours professionnel</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            
            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:pl-8' : 'md:pr-8'} mb-8 md:mb-0`}>
                    <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                          <p className="text-blue-600 font-semibold">{exp.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{exp.period}</p>
                      <p className="text-gray-700 leading-relaxed mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto relative z-10 text-white text-xl">
                      {index === 0 ? '💼' : index === 1 ? '🌐' : '🚀'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Formation
            </h2>
            <p className="text-xl text-gray-600">Mon parcours académique et certifications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                    {edu.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{edu.title}</h3>
                    <p className="text-blue-600 font-semibold">{edu.school}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{edu.period}</p>
                <p className="text-gray-700 leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mes Projets
            </h2>
            <p className="text-xl text-gray-600">Une sélection de mes réalisations récentes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl text-white">
                  {project.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button className="text-blue-600 hover:text-purple-600 font-medium transition-colors">
                      Voir le projet
                    </button>
                    <button className="text-blue-600 hover:text-purple-600 font-medium transition-colors">
                      Code source
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mon Blog
            </h2>
            <p className="text-xl text-gray-600">Mes réflexions et découvertes sur le développement web</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-3xl text-white">
                  {post.icon}
                </div>
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">{post.date}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{post.description}</p>
                  <button className="text-blue-600 hover:text-purple-600 font-medium transition-colors">
                    Lire l'article →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Travaillons ensemble</h2>
          <p className="text-xl mb-8 opacity-90">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour discuter de vos besoins.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Votre nom"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <input
                type="email"
                placeholder="Votre email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <input
              type="text"
              placeholder="Sujet"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <textarea
              placeholder="Votre message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            ></textarea>
            <button
              type="submit"
              className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300 hover:transform hover:scale-105 border border-white/30"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              title="LinkedIn"
            >
              💼
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              title="GitHub"
            >
              🐱
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              title="Email"
            >
              📧
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
              title="Twitter"
            >
              🐦
            </a>
          </div>
          <p className="text-gray-400">
            &copy; 2025 [Votre Nom]. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;