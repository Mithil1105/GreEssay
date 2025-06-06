import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  @media (max-width: 600px) {
    padding: 0 0.5rem;
    margin: 1rem 0;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme, $green }) => $green ? '#28a745' : theme.primary};
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background-color: ${({ theme, $green }) => $green ? '#218838' : theme.secondary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled(Button)`
  background-color: ${({ $active }) => $active ? '#28a745' : '#f8f9fa'};
  color: ${({ $active }) => $active ? '#fff' : '#333'};
  border: 1px solid #28a745;
  &:hover {
    background-color: ${({ $active }) => $active ? '#218838' : '#e2e6ea'};
    color: #333;
  }
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

const PromptBox = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 1.2rem;
  min-height: 80px;
  max-height: 220px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.2rem;
  border: 1px solid ${({ theme }) => theme.border};
  word-break: break-word;
  font-family: 'Fira Mono', 'Consolas', monospace;
  overflow-y: auto;
`;

const CharSpan = styled.span`
  ${({ $correct, $incorrect, $current, $hardMode }) =>
    !$hardMode &&
    css`
      background: ${$correct ? '#d4edda' : $incorrect ? '#f8d7da' : 'none'};
      color: ${$incorrect ? '#dc3545' : $correct ? '#28a745' : 'inherit'};
      border-bottom: ${$current ? '2px solid #007bff' : 'none'};
      font-weight: ${$current ? 700 : 400};
      text-decoration: ${$current ? 'underline' : 'none'};
      transition: background 0.1s;
    `}
`;

const TypingArea = styled.textarea`
  width: 100%;
  height: 220px;  // Fixed height to ensure scrolling
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  resize: none;  // Prevent resizing
  overflow-y: scroll;  // Ensure scrolling
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  transition: ${({ theme }) => theme.transition};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  font-family: 'Fira Mono', 'Consolas', monospace;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const Stat = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  min-width: 110px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 600px) {
    min-width: 80px;
    padding: 0.5rem 0.7rem;
  }
`;

const ResultBox = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
`;

const InfoNote = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-left: 4px solid #17a2b8;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-style: italic;
  opacity: 0.85;
`;

const Footer = styled.footer`
  width: 100%;
  background: #23272f;
  color: #fff;
  text-align: center;
  padding: 1.2rem 0 1rem 0;
  margin-top: 2.5rem;
  font-size: 1.08rem;
  letter-spacing: 0.01em;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.07);
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.7rem 0 0.5rem 0;
    margin-top: 1.2rem;
  }
`;

const sampleTexts = [
  `Every day, I wake up early in the morning. The sun is rising, and the birds are singing outside my window. I get out of bed, brush my teeth, and wash my face. Then, I eat breakfast. I like toast and milk. Sometimes I have eggs too.

After breakfast, I go to school. I carry my bag and books. The school is not far from my house, so I walk there with my friends. We talk and laugh on the way. School starts at 9 o'clock. We study different subjects like math, English, and science. I try to listen to the teacher and do my homework on time.

At noon, we have lunch. I eat the food my mom packed for me. After lunch, we play outside for a short time. Then, we go back to our classes. School ends at 3 o'clock. I walk home and say goodbye to my friends.

When I get home, I change my clothes and rest for a bit. Later, I do my homework. If I finish early, I play games or watch TV. In the evening, I help my mom set the table. We eat dinner together. After dinner, I brush my teeth and go to bed.

That is a simple day in my life. It is not very exciting, but I like it. Every day is almost the same, but I try to be happy and do my best.`,
  `My favorite hobby is drawing. I love to draw pictures of animals, flowers, and people. I started drawing when I was very young. I used to draw with crayons, but now I use pencils and colors. Drawing makes me happy and calm.

When I draw, I feel peaceful. I forget about everything else and just think about the picture I am making. I can spend hours drawing without getting bored. Sometimes I draw from my imagination, and other times I draw things I see around me.

I also like to show my drawings to my family and friends. They say nice things about them, and that makes me feel proud. Sometimes they ask me to draw something for them, like a card or a gift. I enjoy doing that.

Drawing helps me express my thoughts. If I am feeling sad, I draw. If I am feeling excited, I draw. It is like my way of talking without using words. That is why I love it so much.

I hope I can learn more about drawing as I grow. Maybe one day, I will become a great artist. But even if I don't, I will still keep drawing because it brings me joy.`,
  `One of the most memorable events from my childhood was the day I learned how to ride a bicycle. I was about seven years old at the time. My parents had bought me a shiny red bicycle with black handles. I was excited to learn, but I was also a little scared.

At first, my dad held the back of the bike while I tried to pedal. I kept wobbling and almost fell many times. But he kept telling me not to give up. My mom was watching and cheering me on from the side.

After several tries, my dad suddenly let go without telling me. I didn't notice right away. I was riding the bike all by myself! When I realized he wasn't holding me anymore, I got nervous and almost lost balance. But I managed to keep going and reach the end of the street.

Everyone clapped and shouted with joy. I felt so proud and free. That was the moment I understood what it felt like to succeed after trying again and again. I spent the rest of the day riding around the neighborhood.

Even now, whenever I see kids learning to ride a bike, I remember that special day. It taught me that with patience and practice, I can achieve anything.`,
  `Physical activity plays an essential role in maintaining good health. Whether it's walking, running, cycling, or playing a sport, moving your body helps you feel better physically and mentally. People of all ages can benefit from being active, and even small efforts can lead to big changes over time.

One of the most important benefits of physical activity is that it improves your physical health. Regular movement helps strengthen the heart and lungs, reduces the risk of diseases like diabetes and high blood pressure, and helps you maintain a healthy weight. It also strengthens muscles and bones, which is especially important as people grow older.

Beyond physical benefits, exercise has a powerful effect on the mind. It helps reduce stress, anxiety, and even symptoms of depression. After a workout, many people say they feel happier or more relaxed. This is because the body releases chemicals like endorphins that make you feel good. Physical activity also helps you sleep better and improves your concentration during the day.

Another key benefit is increased energy. People who exercise regularly often find they have more energy to do their daily tasks. It might seem tiring at first, but over time, it actually makes you feel more awake and ready for the day.

It's important to remember that you don't need to become a professional athlete to enjoy these benefits. Simple activities like walking for 30 minutes a day or dancing to your favorite music can be enough. The goal is to move regularly and stay consistent.

In conclusion, regular physical activity is a powerful way to take care of both your body and your mind. No matter your age or skill level, being active can improve your life in many ways.`,
  `One place I've always dreamed of visiting is Kyoto, Japan. Known for its rich culture, beautiful temples, and peaceful gardens, Kyoto offers a unique blend of tradition and modernity. It's a city that tells the story of Japan's past while still embracing the present.

The first reason I want to visit Kyoto is its deep connection to history. As Japan's former capital, Kyoto is home to more than a thousand temples and shrines. Some of the most famous include the golden Kinkaku-ji and the peaceful Ryoan-ji with its stone garden. Walking through these historic places feels like stepping back in time.

Another reason is the city's nature. Kyoto has some of the most stunning seasonal landscapes in the world. In spring, cherry blossoms bloom across parks and riverbanks, creating a sea of pink. In autumn, the leaves turn bright shades of red and gold. I would love to take slow walks through the bamboo forest in Arashiyama or enjoy a quiet moment in a traditional garden.

Kyoto is also known for its unique culture. Traditional tea ceremonies, geisha performances, and local crafts offer a glimpse into Japan's heritage. I would enjoy trying Japanese food made in the Kyoto style, such as matcha sweets, tofu dishes, and seasonal bento boxes.

Finally, I'm drawn to the calm atmosphere of Kyoto. Unlike Tokyo, which is fast-paced and busy, Kyoto is known for being quiet and reflective. It seems like the perfect place to pause, learn, and appreciate life more deeply.

Visiting Kyoto would be more than just a vacation—it would be a meaningful experience that combines culture, beauty, and inner peace.`,
  `In a world filled with distractions and tight schedules, time management is one of the most valuable skills a student can develop. Effective time management allows students to balance academics, social life, and personal goals. Without it, even the most talented students may struggle to meet deadlines or maintain mental well-being.

Time management starts with understanding priorities. Not all tasks are equally important, and successful students learn to identify which ones deserve more attention. This means planning ahead, breaking down assignments into smaller tasks, and avoiding the habit of last-minute work. Tools like calendars, planners, and digital apps can help structure a student's day and make sure nothing is forgotten.

One of the biggest benefits of managing time well is reduced stress. When students know what they need to do and when to do it, they are less likely to panic before exams or projects. This calmness can also lead to better sleep and higher productivity, both of which are key to academic success.

Good time management also helps students build life skills. It teaches discipline, responsibility, and the ability to set realistic goals. These skills are not only useful in school, but also in future jobs and personal life. Students who manage their time well are more likely to become dependable professionals and balanced individuals.

However, time management is not about filling every minute of the day. It's about creating space—space to study, to rest, and to grow. It allows students to avoid burnout by making time for hobbies, friendships, and self-care.

In conclusion, time management is more than a study technique—it is a foundation for success. By learning how to manage their time, students gain control over their lives and prepare themselves for the challenges of the future.`,
  `The impact of technology on modern communication has been both profound and transformative. Over the past few decades, the way humans exchange ideas has shifted dramatically from face-to-face conversations and written letters to instant digital interactions across vast distances. While this shift has brought numerous advantages, it also presents several challenges that deserve consideration.

One of the most significant benefits of technological advancement is the speed and convenience it offers. With tools such as email, instant messaging, and video conferencing, individuals can communicate with others anywhere in the world almost instantaneously. This has been particularly beneficial in professional settings, where businesses can collaborate globally without the need for travel. It has also strengthened social connections by enabling people to stay in touch with friends and family regardless of geographical barriers.

Social media platforms have further revolutionized communication by making it more interactive and accessible. People can now share ideas, photos, and updates with a global audience, often in real time. This democratization of communication has empowered individuals to build communities, raise awareness about important issues, and engage in public discourse.

However, the rise of digital communication also comes with drawbacks. One major concern is the decline in face-to-face interaction, which may affect the development of interpersonal skills, empathy, and emotional intelligence. Additionally, the brevity and informality of online communication can sometimes lead to misunderstandings or a lack of depth in conversations.

Another challenge is information overload. With constant notifications and the expectation of instant responses, individuals often feel overwhelmed or distracted. This can reduce the quality of communication and lead to stress or burnout. Furthermore, issues related to privacy and data security have become increasingly relevant, as personal information shared online can be misused or compromised.

In conclusion, while technology has enhanced the efficiency and reach of communication, it has also introduced new complexities. Striking a balance between digital convenience and human connection is essential to ensuring that communication remains meaningful and effective in the modern world.`,
  `Education is universally recognized as a cornerstone of a well-functioning society. It is the means by which knowledge, values, and skills are transmitted from one generation to the next, serving as both a personal and collective tool for development. Beyond individual achievement, the role of education in shaping societal structure, culture, and progress cannot be overstated.

Firstly, education fosters critical thinking, creativity, and informed decision-making. These qualities are essential in a democratic society, where citizens must engage in policy debates, vote responsibly, and contribute to civic life. Educated individuals are more likely to participate actively in their communities and advocate for social justice and equality.

Secondly, education drives economic development. By equipping individuals with technical and vocational skills, educational institutions prepare the workforce of tomorrow. Countries that invest in quality education tend to have stronger economies, lower unemployment rates, and greater innovation. Moreover, education helps reduce poverty by opening up employment opportunities and increasing earning potential.

Culturally, education preserves heritage while promoting openness to diverse perspectives. Schools and universities are spaces where young minds encounter new ideas and challenge existing norms. This can lead to a more tolerant and inclusive society. At the same time, curricula that reflect local history, language, and traditions ensure that cultural identity is respected and preserved.

Importantly, education also plays a role in promoting equity. Although access remains uneven in many parts of the world, education has the potential to level the playing field. It can empower marginalized groups, reduce gender gaps, and combat systemic inequalities. Inclusive education policies, therefore, are critical to achieving long-term social stability.

Despite its benefits, education systems must continually evolve to meet changing societal needs. This includes updating curricula to reflect technological advancements, addressing mental health challenges among students, and ensuring equitable access to quality education across all communities.

In summary, education is not merely a personal achievement; it is a public good that underpins the values, structure, and progress of society. Its impact stretches far beyond the classroom, influencing the kind of world we live in and the future we aspire to build.`,
  `Leadership is not a one-size-fits-all concept. Throughout history and across cultures, various leadership styles have emerged, each shaped by personality, context, and objectives. Two prominent styles—authoritative leadership and democratic leadership—offer distinct advantages and challenges. While both aim to guide teams toward success, their methods and impacts differ significantly.

Authoritative leaders are known for their decisiveness and clarity. They set a clear vision and expect their teams to follow with discipline and precision. Often seen in high-stakes environments such as the military or emergency response, this style is effective when quick decisions and unified action are needed. These leaders command respect, and their confidence can inspire trust, particularly during crises. However, the downside lies in its rigidity. By concentrating power at the top, authoritative leadership may stifle creativity, discourage collaboration, and alienate team members who value input and dialogue.

On the other hand, democratic leaders encourage participation, valuing the opinions and expertise of all team members. This inclusive style fosters a sense of ownership and morale, often leading to innovative ideas and long-term satisfaction. Democratic leadership thrives in environments that reward collaboration, such as research teams or creative industries. Nevertheless, it can also result in slower decision-making, particularly when consensus is difficult to reach. In high-pressure situations, this delay may prove costly.

What unites both styles is their focus on achieving goals and guiding people, but the path they take diverges. The authoritative leader may resemble a captain steering a ship through stormy waters with firm hands, while the democratic leader is more like a conductor, ensuring each instrument contributes harmoniously to the orchestra's success.

Ultimately, the most effective leaders recognize when to apply each style. Great leadership often lies not in strict adherence to one method, but in the ability to adapt—balancing control with consultation, authority with empathy.`,
  `Artificial Intelligence (AI) is transforming every sector it touches—from healthcare and finance to education and defense. While the potential benefits are immense, including increased efficiency, accuracy, and innovation, the ethical implications of AI warrant serious attention. As machines begin to mimic human reasoning and autonomy, society must confront complex questions about accountability, privacy, and moral responsibility.

A primary ethical concern is bias in AI systems. Since algorithms learn from data created by humans, they often reflect existing prejudices. If not properly addressed, this can lead to discriminatory practices, such as biased hiring systems or unjust policing patterns. Ensuring fairness in AI requires transparency in algorithm design, regular audits, and diverse datasets.

Another issue is autonomy. With AI systems making decisions—sometimes without human intervention—where should responsibility lie when something goes wrong? For example, in the case of a self-driving car accident, is the manufacturer, programmer, or machine at fault? This dilemma raises questions about legal frameworks and moral agency that current laws are ill-equipped to resolve.

Privacy is also under threat. AI-powered surveillance, facial recognition, and data analysis tools can monitor individuals with unprecedented precision. Without strong regulations, such capabilities may lead to authoritarian misuse or corporate overreach. Individuals may lose control over their digital identity, compromising basic rights and freedoms.

Moreover, the integration of AI in warfare introduces ethical concerns about life-and-death decisions made by machines. The idea of autonomous weapons acting without human judgment challenges traditional rules of war and blurs the line between ethical strategy and technological domination.

Finally, there's the existential question: should AI be developed to replicate or surpass human intelligence? While some argue this pursuit reflects human curiosity and ambition, others caution against creating entities we cannot fully control or comprehend.

In summary, AI presents a paradox—it can both elevate and endanger humanity. Navigating its ethical landscape requires foresight, interdisciplinary collaboration, and an unwavering commitment to human dignity. As creators of this powerful tool, we must ensure that progress does not come at the cost of conscience.`
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TypingTest = () => {
  const [duration, setDuration] = useState(30); // in seconds, default to 30 seconds
  const [timeLeft, setTimeLeft] = useState(30); // in seconds, default to 30 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [hardMode, setHardMode] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const timerRef = useRef();
  const startTimeRef = useRef();
  const clustrRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const typingAreaRef = useRef(null);

  // Get the text to type
  const promptText = useCustom ? customText : sampleTexts[selectedSampleIdx];

  // Preprocess text to handle paragraphs and whitespace
  const processedText = promptText
    .replace(/\r\n/g, '\n')  // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n')  // Reduce multiple newlines to double newline
    .trim();  // Remove leading/trailing whitespace

  // Improved paragraph splitting
  const paragraphs = processedText
    .split(/\n\s*\n/)  // Split on double newlines or newlines with whitespace
    .map(p => p.replace(/\n/g, ' ').trim())  // Replace internal newlines with spaces and trim
    .filter(p => p.length > 0);  // Remove empty paragraphs

  // Live stats
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, words: 0, mistakes: 0 });

  // Auto-scroll effect
  useEffect(() => {
    if (typingAreaRef.current && isRunning) {
      // Calculate the percentage of text typed
      const typedPercentage = typed.length / processedText.length;

      // Get the total scrollable height
      const scrollHeight = typingAreaRef.current.scrollHeight;
      const clientHeight = typingAreaRef.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      // Calculate scroll position
      const scrollTop = Math.floor(maxScrollTop * typedPercentage);

      // Debugging logs
      console.log('Scroll Debug:', {
        typedLength: typed.length,
        totalTextLength: processedText.length,
        typedPercentage: typedPercentage.toFixed(2),
        scrollHeight,
        clientHeight,
        maxScrollTop,
        calculatedScrollTop: scrollTop
      });

      // Scroll the typing area
      typingAreaRef.current.scrollTop = scrollTop;
    }
  }, [typed, isRunning, processedText]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      // Flash logic: if timer > 60s and timeLeft <= 60, start flashing
      if (duration > 60 && timeLeft <= 60) {
        setFlash(f => !f);
      } else {
        setFlash(false);
      }
    } else if (isRunning && timeLeft === 0) {
      stopTest();
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);

  // Real-time stats calculation
  useEffect(() => {
    if (!isRunning) return;
    const elapsed = duration - timeLeft;
    const minutes = elapsed / 60;

    // Trim and split words, filtering out empty strings
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

    // Calculate mistakes more accurately
    let mistakes = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== (processedText[i] || '')) mistakes++;
    }

    const accuracy = typed.length > 0
      ? Math.max(0, Math.round(((typed.length - mistakes) / typed.length) * 100))
      : 100;

    setStats(prevStats => ({
      wpm,
      accuracy,
      words,
      mistakes,
      maxWpm: Math.max(prevStats.maxWpm || 0, wpm)
    }));
  }, [typed, isRunning, timeLeft, processedText, duration]);

  useEffect(() => {
    // Dynamically inject ClustrMaps script
    if (clustrRef.current) {
      const prev = document.getElementById('clustrmaps');
      if (prev) prev.remove();
      const script = document.createElement('script');
      script.id = 'clustrmaps';
      script.type = 'text/javascript';
      script.src = '//clustrmaps.com/map_v2.js?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM';
      clustrRef.current.appendChild(script);
    }
  }, []);

  const startTest = () => {
    if (useCustom && !customText.trim()) {
      alert('Please enter your custom text.');
      return;
    }

    // Validate custom text length
    const minTextLength = 50;  // Minimum text length to start the test
    const maxTextLength = 2000;  // Maximum text length to prevent extremely long texts

    if (useCustom) {
      const trimmedText = customText.trim();
      if (trimmedText.length < minTextLength) {
        alert(`Please enter at least ${minTextLength} characters of text.`);
        return;
      }
      if (trimmedText.length > maxTextLength) {
        alert(`Text is too long. Please limit to ${maxTextLength} characters.`);
        return;
      }
    }

    // Reset state
    setTyped('');
    setStats({ wpm: 0, accuracy: 100, words: 0, mistakes: 0 });
    setTimeLeft(duration);
    setIsRunning(true);
    setShowResult(false);
    setFinalStats(null);
  };

  const stopTest = () => {
    setIsRunning(false);
    setShowResult(true);
    setFinalStats(stats);
  };

  const handleDurationChange = e => {
    const mins = parseInt(e.target.value, 10);
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const handleSampleChange = e => {
    setSelectedSampleIdx(Number(e.target.value));
  };

  // Modify renderPrompt to handle paragraphs
  const renderPrompt = () => {
    return paragraphs.map((paragraph, paragraphIdx) => (
      <React.Fragment key={paragraphIdx}>
        {paragraph.split('').map((char, charIdx) => {
          const absoluteIdx = paragraphs
            .slice(0, paragraphIdx)
            .reduce((sum, p) => sum + p.length + 2, 0) + charIdx;

          let correct = typed[absoluteIdx] === char;
          let incorrect = typed[absoluteIdx] && typed[absoluteIdx] !== char;
          let current = absoluteIdx === typed.length && isRunning;

          return (
            <CharSpan
              key={absoluteIdx}
              $correct={correct}
              $incorrect={incorrect}
              $current={current}
              $hardMode={hardMode}
            >
              {char}
            </CharSpan>
          );
        })}
        {paragraphIdx < paragraphs.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      <Container>
        <Title>Typing Speed Test</Title>
        <InfoNote>
          <b>Note:</b><br />
          - Select the time duration and choose a sample text or enter your own custom text.<br />
          - You can toggle <b>Hard Mode</b> to hide character-by-character feedback.<br />
          - Press <b>Start Test</b> to begin.<br />
          - Your typing statistics (WPM, accuracy, words, mistakes) will be shown live as you type.<br />
          - The test can be stopped at any time, and your results will be displayed at the end.<br />
          - <b>Hard Mode:</b> Hides character highlighting and feedback as you type.
        </InfoNote>
        <ControlsRow>
          <Select value={duration} onChange={e => { setDuration(Number(e.target.value)); setTimeLeft(Number(e.target.value)); }} disabled={isRunning}>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
            <option value={1200}>20 minutes</option>
            <option value={1800}>30 minutes</option>
            <option value={2700}>45 minutes</option>
            <option value={3600}>60 minutes</option>
          </Select>
          <Select value={selectedSampleIdx} onChange={handleSampleChange} disabled={isRunning || useCustom}>
            <option value={0}>Level 1 – Beginner (A Day in My Life)</option>
            <option value={1}>Level 2 – Easy (My Favorite Hobby)</option>
            <option value={2}>Level 3 – Lower-Intermediate (Learning to Ride a Bike)</option>
            <option value={3}>Level 4 – Intermediate (Benefits of Physical Activity)</option>
            <option value={4}>Level 5 – Upper-Intermediate (Kyoto, Japan)</option>
            <option value={5}>Level 6 – Advanced (Time Management)</option>
            <option value={6}>Level 7 – Upper-Intermediate (The Impact of Technology)</option>
            <option value={7}>Level 8 – Advanced (Education)</option>
            <option value={8}>Level 9 – Upper-Intermediate (Leadership)</option>
            <option value={9}>Level 10 – Advanced (Artificial Intelligence)</option>
          </Select>
          <ToggleButton
            type="button"
            active={useCustom}
            onClick={() => setUseCustom(u => !u)}
            disabled={isRunning}
          >
            {useCustom ? 'Use Sample Text' : 'Use Custom Text'}
          </ToggleButton>
          <ToggleButton
            onClick={() => setHardMode(!hardMode)}
            $active={hardMode}
          >
            Hard Mode
          </ToggleButton>
        </ControlsRow>
        {useCustom && !isRunning && (
          <TypingArea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Enter your custom text here..."
            ref={typingAreaRef}
          />
        )}
        <TimeDisplay style={flash ? { background: timeLeft % 2 === 0 ? '#fff' : '#dc3545', color: timeLeft % 2 === 0 ? '#dc3545' : '#fff', transition: 'background 0.3s, color 0.3s' } : {}}>
          Time Remaining: {formatTime(timeLeft)}
        </TimeDisplay>
        <PromptBox style={{ opacity: isRunning ? 1 : 0.7, minHeight: 80 }}>
          {promptText.length === 0 ? (
            <span style={{ color: '#888' }}>Enter or select text above</span>
          ) : (
            hardMode && isRunning
              ? promptText
              : renderPrompt()
          )}
        </PromptBox>
        <TypingArea
          value={typed}
          onChange={e => isRunning && setTyped(e.target.value)}
          placeholder={isRunning ? 'Start typing here...' : `Click 'Start Test' to begin`}
          disabled={!isRunning}
          style={hardMode && isRunning ? { color: 'transparent', textShadow: '0 0 8px #888' } : {}}
          spellCheck={false}
          autoFocus={isRunning}
          ref={typingAreaRef}
        />
        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          {!isRunning ? (
            <Button $green onClick={startTest}>Start Test</Button>
          ) : (
            <Button $green onClick={stopTest}>Stop Test</Button>
          )}
        </div>
        <StatsRow>
          <Stat>WPM<br /><b>{stats.wpm}</b></Stat>
          <Stat>Max WPM<br /><b>{stats.maxWpm || 0}</b></Stat>
          <Stat>Accuracy<br /><b>{stats.accuracy}%</b></Stat>
          <Stat>Words<br /><b>{stats.words}</b></Stat>
          <Stat>Mistakes<br /><b>{stats.mistakes}</b></Stat>
          <Stat>
            <span style={{ fontWeight: 400 }}>Mode</span><br />
            <span>{hardMode ? 'Hard' : 'Normal'}</span>
          </Stat>
        </StatsRow>
        {showResult && finalStats && (
          <ResultBox>
            <h2>Test Complete!</h2>
            <p><b>WPM:</b> {finalStats.wpm}</p>
            <p><b>Max WPM:</b> {finalStats.maxWpm || 0}</p>
            <p><b>Accuracy:</b> {finalStats.accuracy}%</p>
            <p><b>Words Typed:</b> {finalStats.words}</p>
            <p><b>Mistakes:</b> {finalStats.mistakes}</p>
          </ResultBox>
        )}
      </Container>
      <Footer style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 60 }}>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
            <b>ScoreWise</b> &copy; {new Date().getFullYear()}<br />
            Built and developed by Mithil Mistry & Hasti Vakani
          </span>
          <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)' }}>
            <a href="mailto:Mithil20056mistry@gmail.com" title="Contact Us: Mithil20056mistry@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFDD00', color: '#23272f', borderRadius: '50%', width: 40, height: 40, fontWeight: 600, fontSize: '18px', textDecoration: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', transition: 'background 0.2s, color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></svg>
            </a>
          </div>
        </div>
        <div ref={clustrRef} style={{ margin: '0.5rem auto', width: 80, height: 40, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        <noscript>
          <a href="http://www.clustrmaps.com/map/Mithilmistry.tech" title="Visit tracker for Mithilmistry.tech">
            <img src="//www.clustrmaps.com/map_v2.png?d=AYG_JMwPCNULF1JiGcb1M92oLMUck1L-32YGpkdm1FM" alt="ClustrMaps" style={{ width: 80, height: 40, objectFit: 'contain' }} />
          </a>
        </noscript>
      </Footer>
    </>
  );
};

export default TypingTest; 