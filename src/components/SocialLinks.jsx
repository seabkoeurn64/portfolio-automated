import { useEffect } from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// --- Custom Icon Components (Extracted from Data Array for Clarity) ---

const TelegramIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
    <path fill="#229ED9" d="M248 8C111.9 8 0 119.9 0 256s111.9 248 248 248 248-111.9 248-248S384.1 8 248 8zm121.8 169.8l-40.6 193.3c-2.3 11.1-10.7 13.1-18.7 8.3l-55.5-40.4-36 34.5c-4.9 4.9-9.1 6.3-17.7 3.3l-19.1-5.6c-4.4-1.2-8.2-3.8-10.8-7.7-2.7-3.9-3.9-8.7-3.5-13.6l30.2-140.4 125.7-77.9c5.6-3.4 9.4-1.6 6.8 2.5l-142 85.3-24.8 7.4c-6.7 2-10.8 1.1-15.6-4.5l-33.1-31.7c-5.8-5.6-6.6-11.8-1.8-17.5l251-170.5c7.8-5.2 14.2-3.4 19 3.5l30.1 230.1c.5 3.9-.7 8.1-3.5 11.1-2.9 3.1-7 4.9-11.1 4.9-5.4 0-10.7-1.8-15.1-5.3z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#1877F2" d="M504 256C504 119 396 8 256 8S8 119 8 256c0 123.78 90.6 226.37 209.12 245.98V331.43h-58.45V256h58.45v-56.12c0-57.87 34.61-89.81 87.89-89.81 24.63 0 49.88 4.41 49.88 4.41v54.34h-28.7c-28.45 0-37.33 17.67-37.33 35.84V256h65.41l-10.45 75.43h-54.96v120.55C413.4 482.37 504 379.78 504 256z"/>
    </svg>
);

const TikTokIcon = ({ className, ...props }) => (
  <svg
    className={className}
    width="24px"
    height="24px"
    viewBox="0 0 45 45"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Tiktok</title>
    <g
      id="Icon/Social/tiktok-color"
      stroke="none"
      strokeWidth="8"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Group-7" transform="translate(8.000000, 6.000000)">
        <path
          d="M29.5248245,9.44576327 C28.0821306,9.0460898 26.7616408,8.29376327 25.6826204,7.25637551 C25.5109469,7.09719184 25.3493143,6.92821224 25.1928245,6.75433469 C23.9066204,5.27833469 23.209151,3.38037551 23.2336408,1.42290612 L17.3560898,1.42290612 L17.3560898,23.7086204 C17.3560898,27.7935184 15.1520082,29.9535184 12.416498,29.9535184 C11.694049,29.9611102 10.9789469,29.8107429 10.3213959,29.5124571 C9.6636,29.2144163 9.07951837,28.7758041 8.60955918,28.2272327 C8.1398449,27.6789061 7.79551837,27.0340898 7.60180408,26.3385796 C7.4078449,25.6430694 7.36890612,24.9132735 7.48743673,24.2008653 C7.60596735,23.4884571 7.87902857,22.8105796 8.28751837,22.2154776 C8.69625306,21.6198857 9.23037551,21.1212735 9.85241633,20.7546612 C10.474702,20.3878041 11.1694776,20.1617633 11.8882531,20.0924571 C12.6070286,20.023151 13.3324163,20.1122939 14.0129878,20.3535184 L14.0129878,14.3584163 C13.4889061,14.2430694 12.9530694,14.1862531 12.416498,14.1894367 L12.3917633,14.1894367 C10.2542939,14.1943347 8.16604898,14.8325388 6.39127347,16.0234776 C4.61649796,17.2149061 3.23429388,18.9051918 2.41976327,20.8812735 C1.60523265,22.8578449 1.39486531,25.0310694 1.8151102,27.1269061 C2.2351102,29.2227429 3.2671102,31.1469061 4.78033469,32.6564571 C6.29380408,34.1660082 8.22066122,35.1933551 10.3174776,35.6082122 C12.4142939,36.0230694 14.5870286,35.8073143 16.561151,34.9878857 C18.5355184,34.1682122 20.2226204,32.7820898 21.409151,31.0041306 C22.5959265,29.2264163 23.2289878,27.136702 23.228498,24.9992327 L23.228498,12.8155592 C25.5036,14.392702 28.2244163,15.134498 31.1289061,15.1886204 L31.1289061,9.68551837 C30.5869469,9.66568163 30.049151,9.5851102 29.5248245,9.44576327"
          id="Fill-1"
          fill="#FE2C55"
        ></path>
        <path
          d="M25.195102,6.75428571 C24.7946939,6.47510204 24.4148571,6.1675102 24.0587755,5.83346939 C22.8210612,4.66016327 22.0062857,3.11020408 21.7420408,1.42530612 C21.6622041,0.954367347 21.6220408,0.47755102 21.6220408,0 L15.7444898,0 L15.7444898,22.6408163 C15.7444898,27.5069388 13.5404082,28.5183673 10.804898,28.5183673 C10.0829388,28.5262041 9.36783673,28.3758367 8.71028571,28.0773061 C8.0524898,27.7792653 7.46791837,27.3406531 6.99820408,26.7920816 C6.5282449,26.2437551 6.18440816,25.5989388 5.99044898,24.9034286 C5.7964898,24.2079184 5.75755102,23.4781224 5.87583673,22.7657143 C5.99461224,22.053551 6.26767347,21.3756735 6.67640816,20.7800816 C7.08489796,20.1847347 7.61902041,19.6861224 8.24106122,19.3195102 C8.86334694,18.952898 9.55787755,18.7266122 10.276898,18.6573061 C10.9959184,18.588 11.7208163,18.6773878 12.4016327,18.9183673 L12.4016327,12.9328163 C5.40489796,11.8236735 0,17.4783673 0,23.5760816 C0.00465306122,26.4426122 1.14514286,29.1898776 3.17191837,31.216898 C5.19869388,33.2434286 7.94595918,34.3839184 10.8124898,34.3885714 C16.7730612,34.3885714 21.6220408,30.7444898 21.6220408,23.5760816 L21.6220408,11.3924082 C23.8995918,12.9795918 26.6204082,13.7142857 29.524898,13.7632653 L29.524898,8.26040816 C27.9658776,8.18914286 26.4617143,7.66604082 25.195102,6.75428571"
          id="Fill-3"
          fill="#25F4EE"
        ></path>
        <path
          d="M21.6220653,23.5764245 L21.6220653,11.392751 C23.8996163,12.9794449 26.6204327,13.7141388 29.5251673,13.7633633 L29.5251673,9.44581224 C28.0822286,9.04613878 26.7617388,8.29381224 25.6824735,7.25617959 C25.5110449,7.09724082 25.3494122,6.92826122 25.1926776,6.75438367 C24.7922694,6.4752 24.4126776,6.16736327 24.056351,5.83356735 C22.8186367,4.66026122 22.0041061,3.11030204 21.7396163,1.42540408 L17.3730857,1.42540408 L17.3730857,23.7111184 C17.3730857,27.7957714 15.1690041,29.9560163 12.4334939,29.9560163 C11.6569224,29.9538122 10.8918612,29.7681796 10.2005143,29.414302 C9.50941224,29.0601796 8.91186122,28.5476082 8.45635102,27.9182204 C7.49071837,27.3946286 6.72712653,26.5636898 6.2865551,25.5571592 C5.84573878,24.5508735 5.75341224,23.4260571 6.02377959,22.3609959 C6.29390204,21.2959347 6.91177959,20.3516082 7.77896327,19.6771592 C8.64639184,19.0027102 9.71365714,18.6365878 10.8122694,18.6365878 C11.3564327,18.6412408 11.8961878,18.7362612 12.4090041,18.9182204 L12.4090041,14.1894857 C10.304351,14.1921796 8.24647347,14.8093224 6.48786122,15.9657306 C4.72924898,17.1221388 3.3470449,18.7666286 2.51047347,20.6978939 C1.67390204,22.6291592 1.41969796,24.7627102 1.77896327,26.8362612 C2.13822857,28.9098122 3.09553469,30.8334857 4.53308571,32.3704653 C6.36271837,33.6848327 8.55945306,34.3906286 10.8122694,34.3884296 C16.7730857,34.3884296 21.6220653,30.7445878 21.6220653,23.5764245"
          id="Fill-5"
          fill="#000000"
        ></path>
      </g>
    </g>
  </svg>
);
// --- End Custom Icon Components ---


// --- Social Links Data ---
const socialLinks = [
  // 1. LinkedIn (Primary - full width)
  {
    name: "LinkedIn",
    displayName: "Connect on LinkedIn",
    subText: "Professional Profile",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/koeurn65/",
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true,
  },
  // 2. Telegram (Now using extracted component)
  {
    name: "Telegram",
    displayName: "Telegram",
    subText: "Send a Message",
    icon: TelegramIcon, // <-- Clean reference
    url: "YOUR_TELEGRAM_LINK",
    color: "#0088CC",
    gradient: "from-[#0088CC] to-[#006A9E]",
  },
  // 3. Instagram
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@koeurn64",
    icon: Instagram,
    url: "https://www.instagram.com/koeurn64",
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
  },
  // 4. YouTube
  {
    name: "YouTube",
    displayName: "Youtube Channel",
    subText: "@ekoeurn",
    icon: Youtube,
    url: "https://www.youtube.com/@ekoeurn",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
  },
  // 5. GitHub
  {
    name: "GitHub",
    displayName: "Github",
    subText: "View My Code",
    icon: Github,
    url: "https://github.com/seabkoeurn64",
    color: "#6e5494",
    gradient: "from-[#333] to-[#24292e]",
  },
  // 6. TikTok (Now using extracted component)
  {
    name: "TikTok",
    displayName: "Tiktok",
    subText: "@keourn",
    icon: TikTokIcon, // <-- Clean reference
    url: "https://tiktok.com/@eki_zulfar",
    color: "black",
    gradient: "from-[#000000] via-[#25F4EE] to-[#FE2C55]",
  },
  // 7. Facebook Page (Now using extracted component)
  {
    name: "Facebook",
    displayName: "Facebook Page",
    subText: "Latest Updates",
    icon: FacebookIcon, // <-- Clean reference
    url: "YOUR_FACEBOOK_PAGE_LINK",
    color: "#1877F2",
    gradient: "from-[#1877F2] to-[#3B5998]",
  },
];


// --- Reusable Social Link Item Component ---
const SocialLinkItem = ({ link, delay, isPrimary = false }) => {
  const Icon = link.icon;
  
  // Conditionally set classes for primary vs. grid links
  const baseClasses = "group relative flex items-center bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500";
  const primaryClasses = "justify-between p-4 rounded-xl";
  const gridClasses = "gap-3 p-3.5 rounded-xl"; 

  // Standardized icon and text sizes
  const iconSizeClass = isPrimary ? "w-6 h-6" : "w-5 h-5";
  const pContainer = isPrimary ? "p-2" : "p-1.5"; 

  // Standardized text sizes
  const displayNameClass = isPrimary ? "text-lg font-bold pt-[0.2rem] tracking-tight leading-none" : "text-sm font-bold";
  const subTextClass = isPrimary ? "text-sm" : "text-xs";
  
  // Standardized ExternalLink size
  const externalLinkClass = isPrimary ? "w-5 h-5" : "w-4 h-4";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${isPrimary ? primaryClasses : gridClasses}`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Hover Gradient Background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${link.gradient}`}
      />

      {/* Content Container */}
      <div className="relative flex items-center gap-4">
        {/* Icon Container with subtle background hover effect */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                       group-hover:scale-105 group-hover:opacity-30" 
            style={{ backgroundColor: link.color }}
          />
          <div className={`relative rounded-lg ${pContainer}`}>
            <Icon
              className={`${iconSizeClass} transition-all duration-500 group-hover:scale-105`}
              // Handle icon color for white/black icons on a dark theme
              style={{ color: (link.name === 'GitHub' || link.name === 'TikTok') ? '#fff' : link.color }}
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col min-w-0">
          <span className={`${displayNameClass} text-gray-200 group-hover:text-white transition-colors duration-300`}>
            {link.displayName}
          </span>
          <span className={`${subTextClass} text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300`}>
            {link.subText}
          </span>
        </div>
      </div>

      {/* External Link Icon */}
      <ExternalLink
        className={`${externalLinkClass} text-gray-500 group-hover:text-white ml-auto relative
                   opacity-0 group-hover:opacity-100 transition-all duration-300
                   transform group-hover:translate-x-0 ${isPrimary ? "-translate-x-1" : "-translate-x-2"}`}
      />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                     translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
        />
      </div>
    </a>
  );
};


// --- Main SocialLinks Component ---
const SocialLinks = () => {
  const linkedIn = socialLinks.find((link) => link.isPrimary);
  const otherLinks = socialLinks.filter((link) => !link.isPrimary);
  
  useEffect(() => {
    AOS.init({
      offset: 10,
    });
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 py-8 backdrop-blur-xl shadow-xl">
      <h3
        className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3"
        data-aos="fade-down"
      >
        <span className="inline-block w-8 h-1.5 bg-indigo-500 rounded-full"></span>
        **Connect With Me** 🚀
      </h3>

      <div className="flex flex-col gap-4">
        {/* LinkedIn - Primary Row (Full Width) */}
        <SocialLinkItem link={linkedIn} delay={100} isPrimary={true} />

        {/* All Other Links - Single, Scalable Grid (2 columns on medium/larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherLinks.map((link, index) => (
            <SocialLinkItem
              key={link.name}
              link={link}
              // Adjust delay to cascade nicely
              delay={200 + index * 100} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;