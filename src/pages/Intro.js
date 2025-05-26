import React, { useEffect, useRef, useState } from 'react'; 
import { Globe, Users, MessagesSquare, Handshake } from 'lucide-react';
import PlaneButton from '../components/PlaneButton';
import sky1 from '../assets/images/1.jpeg';
import sky2 from '../assets/images/2.jpeg';
import sky3 from '../assets/images/3.jpeg';
import sky4 from '../assets/images/4.jpeg';
import planeIcon from '../assets/images/plane.jpg';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

const images = [sky1, sky2, sky3, sky4];

// ✅ 4개 section 각각에 여러 나라 언어 번역 추가
const sectionData = [
  {
    title: '글로벌한 만남의 시작',
    content: '세계 곳곳에서 모인 학생들이 한 팀이 되어 도전합니다.',
    translations: {
      en: {
        title: 'The Beginning of Global Encounters',
        content: 'Students from all over the world come together as one team to take on challenges.',
      },
      ja: {
        title: 'グローバルな出会いの始まり',
        content: '世界中から集まった学生たちが一つのチームとなり挑戦します。',
      },
      es: {
        title: 'El comienzo de encuentros globales',
        content: 'Estudiantes de todo el mundo se unen como un equipo para enfrentar desafíos.',
      },
      vi: {
        title: 'Bắt đầu của những cuộc gặp gỡ toàn cầu',
        content: 'Sinh viên từ khắp nơi trên thế giới cùng nhau thành một đội để thử thách.',
      },
    },
  },
  {
    title: '함께하는 프로젝트',
    content: '같은 목표를 가진 사람들과 함께 협업해보세요.',
    translations: {
      en: {
        title: 'Collaborative Projects',
        content: 'Work together with people who share the same goals.',
      },
      ja: {
        title: '共に取り組むプロジェクト',
        content: '同じ目標を持つ人たちと一緒に協力しましょう。',
      },
      es: {
        title: 'Proyectos en colaboración',
        content: 'Colabora con personas que tienen los mismos objetivos.',
      },
      vi: {
        title: 'Dự án hợp tác cùng nhau',
        content: 'Làm việc cùng những người có cùng mục tiêu.',
      },
    },
  },
  {
    title: '실시간 소통의 자유',
    content: '언어 장벽 없이 자유롭게 아이디어를 나눌 수 있어요.',
    translations: {
      en: {
        title: 'Freedom of Real-time Communication',
        content: 'Share ideas freely without language barriers.',
      },
      ja: {
        title: 'リアルタイムコミュニケーションの自由',
        content: '言語の壁を越えて自由にアイデアを共有できます。',
      },
      es: {
        title: 'Libertad de comunicación en tiempo real',
        content: 'Comparte ideas libremente sin barreras idiomáticas.',
      },
      vi: {
        title: 'Tự do giao tiếp thời gian thực',
        content: 'Chia sẻ ý tưởng tự do mà không bị rào cản ngôn ngữ.',
      },
    },
  },
  {
    title: '지속 가능한 네트워킹',
    content: '만남은 프로젝트에서 끝나지 않습니다. 인연을 이어가세요.',
    translations: {
      en: {
        title: 'Sustainable Networking',
        content: 'Connections don’t end with projects. Keep your relationships going.',
      },
      ja: {
        title: '持続可能なネットワーキング',
        content: '出会いはプロジェクトで終わりません。つながりを続けましょう。',
      },
      es: {
        title: 'Redes sostenibles',
        content: 'Las conexiones no terminan con los proyectos. Mantén tus relaciones.',
      },
      vi: {
        title: 'Mạng lưới bền vững',
        content: 'Các kết nối không kết thúc với dự án. Hãy duy trì mối quan hệ của bạn.',
      },
    },
  },
];

const Intro = () => {
  const parallaxRef = useRef(null);
  const imgRefs = useRef([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [planeOffset, setPlaneOffset] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const vh = window.innerHeight;
    const speed = 0.5;
    let lastScrollY = 0;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenis.on("scroll", (e) => {
      const scrollY = e.scroll;

      if (scrollY > lastScrollY) {
        images.forEach((_, i) => {
          const imgEl = imgRefs.current[i];
          if (imgEl && parallaxRef.current) {
            const sectionTop = parallaxRef.current.offsetTop + i * 2 * vh;
            const offset = scrollY - sectionTop;

            gsap.set(imgEl, {
              y: offset * speed,
            });
          }
        });
      }

      if (parallaxRef.current) {
        const base = parallaxRef.current.offsetTop;
        const idx = Math.floor((scrollY - base + vh / 2) / (2 * vh));
        if (idx >= 0 && idx < images.length) {
          setVisibleIndex(idx);
          setPlaneOffset(scrollY - (base + idx * 2 * vh));
        } else {
          setVisibleIndex(-1);
        }
      }

      lastScrollY = scrollY;
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  const scrollToParallax = () => {
    parallaxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-x-hidden bg-white">
      {/* Intro Section */}
      <div className="relative z-40 pt-32 md:pt-40 text-center px-4 bg-gradient-to-r from-blue-100 via-white to-blue-200">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          유학생 팀매칭 플랫폼
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          세계 각국의 유학생들과 국내 학생들이 팀을 이루어 함께 성장하는 공간
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide text-gray-800">
          FROM SOLO TO TEAM
        </h1>
        <div className="border-t-4 md:border-t-8 border-gray-300 w-48 md:w-80 lg:w-96 mx-auto mt-4"></div>

        <div className="mt-6 flex justify-center">
          <PlaneButton onClick={scrollToParallax} />
        </div>
      </div>

      <div className="relative h-[960px] bg-gradient-to-b from-transparent to-blue-100 flex justify-center items-start">
        <div className="w-3 h-full bg-white rounded-full opacity-90 blur-md shadow-md"></div>
      </div>

      {/* Parallax Section */}
      <div ref={parallaxRef} className="relative z-20">
        {images.map((img, i) => (
          <React.Fragment key={i}>
            <section id={`ps-${i}`} className="h-screen flex items-center justify-center">
              <div className="border-8 border-white shadow-lg bg-white w-11/12 md:w-4/5 lg:w-3/5 h-3/4 md:h-4/5 overflow-hidden relative">
                <img
                  ref={(el) => (imgRefs.current[i] = el)}
                  src={img}
                  alt={`plane-${i}`}
                  className="parallax-img absolute top-0 left-0 w-full h-full object-cover"
                />
                {visibleIndex === i && planeOffset >= 0 && planeOffset <= window.innerHeight && (
                  <img
                    src={planeIcon}
                    alt="plane icon"
                    style={{
                      top: `${planeOffset}px`,
                      width: '200px',
                      height: '200px',
                    }}
                    className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
                  />
                )}
              </div>
            </section>

            {/* ✅ 이미지 아래 개별 박스 제목/내용과 번역문 같이 표시 */}
            <section className="h-screen flex flex-col justify-center items-center px-4 md:px-6 lg:px-8 text-center bg-gradient-to-r from-blue-100 via-white to-blue-200 space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {sectionData[i]?.title}
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl">
                {sectionData[i]?.content}
              </p>

              {/* 번역문 */}
              <div className="max-w-2xl text-left space-y-3 mt-6 w-full md:px-20">
                {sectionData[i]?.translations && Object.entries(sectionData[i].translations).map(([lang, { title, content }]) => (
                  <div key={lang} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-semibold text-lg text-blue-600 capitalize">{lang}</h3>
                    <h4 className="font-bold text-md text-gray-800">{title}</h4>
                    <p className="text-sm md:text-base text-gray-600">{content}</p>
                  </div>
                ))}
              </div>
            </section>
          </React.Fragment>
        ))}
      </div>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 md:p-10 lg:p-16 bg-gradient-to-r from-gray-100 via-white to-gray-200">
        {[ 
          { icon: Globe, title: '다양한 활동 정보', desc: '경기도 내 공모전과 대외활동 한눈에 보기' },
          { icon: Users, title: '맞춤형 팀매칭', desc: '나에게 딱 맞는 팀원 연결' },
          { icon: MessagesSquare, title: '실시간 번역', desc: '자유로운 의사소통' },
          { icon: Handshake, title: '커뮤니티 지원', desc: '후기 보고 활동 찾고, 편하게 질문하기' },
        ].map((item, idx) => (
          <div key={idx} className="space-y-2 text-center">
            <item.icon className="mx-auto text-blue-500" size={40} />
            <h3 className="font-bold text-lg md:text-xl">{item.title}</h3>
            <p className="text-sm md:text-base text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="p-10 bg-gradient-to-r from-blue-50 via-white to-blue-50 text-center">
        <p className="max-w-2xl mx-auto text-gray-600">
          * 제공되는 모든 콘텐츠는 참고용입니다. 실제 서비스와 다를 수 있습니다.
        </p>
      </section>
    </div>
  );
};

export default Intro;
