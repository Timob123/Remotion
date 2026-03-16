import { AbsoluteFill, useCurrentFrame, interpolate, Img, useVideoConfig } from "remotion";

const TARGET_WORD = "Broken Loyalty";

// Sets of 3 comments that change together (above, center with loyalty, below)
// Many more sets for the spinning wheel effect
const commentSets = [
  {
    above: { username: "sarah_m", text: "Sure I'm fed up with these yokes. They never reward you at all!", avatar: "https://i.pravatar.cc/150?img=1", time: "2h" },
    center: { username: "lisa_says", text: "I'm absolutely sick of Broken Loyalty programs. They're only data collection schemes, so they are.", avatar: "https://i.pravatar.cc/150?img=7", time: "1h" },
    below: { username: "mike_reviews", text: "Every card I have is a pure scam. The points expire before you can use them at all.", avatar: "https://i.pravatar.cc/150?img=4", time: "5h" },
  },
  {
    above: { username: "techguru23", text: "Ah sure, the traditional schemes are broken entirely. Time for something new, I'd say.", avatar: "https://i.pravatar.cc/150?img=2", time: "3h" },
    center: { username: "alex_views", text: "Traditional Broken Loyalty cards offer nothing back at all. It's time for a change, so it is.", avatar: "https://i.pravatar.cc/150?img=8", time: "1h" },
    below: { username: "jenny_talks", text: "I've given up on them entirely. They don't value customers anymore, sure they don't.", avatar: "https://i.pravatar.cc/150?img=5", time: "6h" },
  },
  {
    above: { username: "consumer_voice", text: "Why do they make it so hard to redeem yer points? It's gas, so it is.", avatar: "https://i.pravatar.cc/150?img=3", time: "4h" },
    center: { username: "maya_thoughts", text: "The Broken Loyalty industry needs a complete overhaul. The current systems are broken entirely.", avatar: "https://i.pravatar.cc/150?img=9", time: "1h" },
    below: { username: "david_thoughts", text: "The whole thing needs to be reimagined. The current systems are outdated, so they are.", avatar: "https://i.pravatar.cc/150?img=6", time: "7h" },
  },
  {
    above: { username: "emma_voice", text: "These reward systems are fierce complicated. Why can't they just be simple?", avatar: "https://i.pravatar.cc/150?img=11", time: "2h" },
    center: { username: "james_reviews", text: "I've lost all trust in Broken Loyalty programs. They don't deliver on their promises at all.", avatar: "https://i.pravatar.cc/150?img=10", time: "1h" },
    below: { username: "sophia_says", text: "Sure it feels like every company has a loyalty program but none of them work at all.", avatar: "https://i.pravatar.cc/150?img=13", time: "3h" },
  },
  {
    above: { username: "chris_talks", text: "I've tried so many different programs and they all disappoint. It's a joke, so it is.", avatar: "https://i.pravatar.cc/150?img=12", time: "4h" },
    center: { username: "emma_voice", text: "Broken Loyalty schemes are outdated entirely. We need something that actually rewards us, so we do.", avatar: "https://i.pravatar.cc/150?img=11", time: "1h" },
    below: { username: "ryan_views", text: "The points never add up to anything meaningful. It's all a waste of time, so it is.", avatar: "https://i.pravatar.cc/150?img=14", time: "5h" },
  },
  {
    above: { username: "maya_thoughts", text: "Why do they make it so hard to actually use yer rewards? It's ridiculous, so it is.", avatar: "https://i.pravatar.cc/150?img=9", time: "6h" },
    center: { username: "chris_talks", text: "Every Broken Loyalty program I've tried has been disappointing. Time for innovation, I'd say.", avatar: "https://i.pravatar.cc/150?img=12", time: "1h" },
    below: { username: "lisa_says", text: "I just want something that actually values me as a customer. Is that too much to ask?", avatar: "https://i.pravatar.cc/150?img=7", time: "7h" },
  },
  {
    above: { username: "james_reviews", text: "The expiration dates on points are fierce ridiculous. They expire before you can use them at all.", avatar: "https://i.pravatar.cc/150?img=10", time: "8h" },
    center: { username: "sophia_says", text: "The phrase Broken Loyalty means nothing when programs don't value customers, sure they don't.", avatar: "https://i.pravatar.cc/150?img=13", time: "1h" },
    below: { username: "alex_views", text: "There has to be a better way to reward customers who keep coming back. Fair play to them.", avatar: "https://i.pravatar.cc/150?img=8", time: "9h" },
  },
  {
    above: { username: "ryan_views", text: "I'm tired of signing up for programs that never deliver. It's a pure waste, so it is.", avatar: "https://i.pravatar.cc/150?img=14", time: "10h" },
    center: { username: "ryan_views", text: "I'm done with Broken Loyalty cards entirely. They're all the same - empty promises, so they are.", avatar: "https://i.pravatar.cc/150?img=14", time: "1h" },
    below: { username: "maya_thoughts", text: "We need a complete reset of how loyalty programs work. The whole thing is broken, so it is.", avatar: "https://i.pravatar.cc/150?img=9", time: "11h" },
  },
  {
    above: { username: "sean_irish", text: "Sure these programs are a pure cod. They never work properly at all.", avatar: "https://i.pravatar.cc/150?img=15", time: "1h" },
    center: { username: "aoife_dublin", text: "Broken Loyalty programs are a complete mess. They don't reward anyone properly, so they don't.", avatar: "https://i.pravatar.cc/150?img=16", time: "1h" },
    below: { username: "ciaran_cork", text: "I'm fed up entirely with these schemes. They're all a load of nonsense.", avatar: "https://i.pravatar.cc/150?img=17", time: "2h" },
  },
  {
    above: { username: "niamh_galway", text: "Why do they make it so complicated? Sure it should be simple, so it should.", avatar: "https://i.pravatar.cc/150?img=18", time: "3h" },
    center: { username: "padraig_limerick", text: "The Broken Loyalty system is completely broken. We need something better entirely.", avatar: "https://i.pravatar.cc/150?img=19", time: "1h" },
    below: { username: "sinead_waterford", text: "I've given up on them completely. They're not worth the hassle at all.", avatar: "https://i.pravatar.cc/150?img=20", time: "4h" },
  },
  {
    above: { username: "conor_belfast", text: "These reward cards are a pure joke. They never deliver what they promise.", avatar: "https://i.pravatar.cc/150?img=21", time: "5h" },
    center: { username: "eilis_kerry", text: "Broken Loyalty programs are a waste of time entirely. We deserve better, so we do.", avatar: "https://i.pravatar.cc/150?img=22", time: "1h" },
    below: { username: "dara_wexford", text: "Sure the points expire before you can use them. It's ridiculous, so it is.", avatar: "https://i.pravatar.cc/150?img=23", time: "6h" },
  },
  {
    above: { username: "riona_kilkenny", text: "I'm sick of signing up for programs that never work. It's a pure scam.", avatar: "https://i.pravatar.cc/150?img=24", time: "7h" },
    center: { username: "fionn_donegal", text: "Every Broken Loyalty scheme I've tried has been a disappointment. Time for change.", avatar: "https://i.pravatar.cc/150?img=25", time: "1h" },
    below: { username: "grainne_sligo", text: "The whole system needs to be fixed. It's broken entirely, so it is.", avatar: "https://i.pravatar.cc/150?img=26", time: "8h" },
  },
  {
    above: { username: "tadhg_clare", text: "Why can't they just reward us properly? Is that too much to ask?", avatar: "https://i.pravatar.cc/150?img=27", time: "9h" },
    center: { username: "brighid_tipperary", text: "Broken Loyalty cards are all the same - empty promises and no rewards.", avatar: "https://i.pravatar.cc/150?img=28", time: "1h" },
    below: { username: "colm_wicklow", text: "I'm done with these programs entirely. They don't value customers at all.", avatar: "https://i.pravatar.cc/150?img=29", time: "10h" },
  },
  {
    above: { username: "deirdre_mayo", text: "The expiration dates are fierce annoying. Points expire before you can use them.", avatar: "https://i.pravatar.cc/150?img=30", time: "11h" },
    center: { username: "eoghan_roscommon", text: "Broken Loyalty means nothing when companies don't care about customers.", avatar: "https://i.pravatar.cc/150?img=31", time: "1h" },
    below: { username: "fiona_cavan", text: "We need a better way to reward loyal customers. The current system is a joke.", avatar: "https://i.pravatar.cc/150?img=32", time: "12h" },
  },
  {
    above: { username: "garrett_monaghan", text: "Sure these programs are a complete waste of time. They never work properly.", avatar: "https://i.pravatar.cc/150?img=33", time: "13h" },
    center: { username: "hazel_longford", text: "I've lost all faith in Broken Loyalty programs. They're all the same.", avatar: "https://i.pravatar.cc/150?img=34", time: "1h" },
    below: { username: "iona_leitrim", text: "The points system is broken entirely. We need something that actually works.", avatar: "https://i.pravatar.cc/150?img=35", time: "14h" },
  },
  {
    above: { username: "jack_louth", text: "Why do they make it so hard to redeem rewards? It's gas, so it is.", avatar: "https://i.pravatar.cc/150?img=36", time: "15h" },
    center: { username: "kathleen_meath", text: "Broken Loyalty schemes are outdated. We need innovation, so we do.", avatar: "https://i.pravatar.cc/150?img=37", time: "1h" },
    below: { username: "liam_offaly", text: "I'm tired of programs that don't deliver. It's a pure waste of effort.", avatar: "https://i.pravatar.cc/150?img=38", time: "16h" },
  },
  {
    above: { username: "mairead_westmeath", text: "Sure every company has a program but none of them work properly at all.", avatar: "https://i.pravatar.cc/150?img=39", time: "17h" },
    center: { username: "noel_laois", text: "Broken Loyalty programs don't reward customers. They're just data collection.", avatar: "https://i.pravatar.cc/150?img=40", time: "1h" },
    below: { username: "orla_carlow", text: "The whole concept needs to be reimagined. Current systems are broken.", avatar: "https://i.pravatar.cc/150?img=41", time: "18h" },
  },
  {
    above: { username: "patrick_kildare", text: "I've tried so many programs and they all disappoint. It's ridiculous.", avatar: "https://i.pravatar.cc/150?img=42", time: "19h" },
    center: { username: "queenie_dublin2", text: "Broken Loyalty cards offer nothing in return. Time for something better.", avatar: "https://i.pravatar.cc/150?img=43", time: "1h" },
    below: { username: "ronan_wexford2", text: "We need programs that actually value customers. The current ones don't work.", avatar: "https://i.pravatar.cc/150?img=44", time: "20h" },
  },
  {
    above: { username: "saoirse_cork2", text: "Sure the points never add up to anything. It's all a waste, so it is.", avatar: "https://i.pravatar.cc/150?img=45", time: "21h" },
    center: { username: "tomas_galway2", text: "Broken Loyalty programs are a complete failure. We deserve better entirely.", avatar: "https://i.pravatar.cc/150?img=46", time: "1h" },
    below: { username: "una_limerick2", text: "I'm done with these schemes. They're all empty promises and no rewards.", avatar: "https://i.pravatar.cc/150?img=47", time: "22h" },
  },
  {
    above: { username: "violet_waterford2", text: "Why can't they just make it simple? The current system is too complicated.", avatar: "https://i.pravatar.cc/150?img=48", time: "23h" },
    center: { username: "william_belfast2", text: "Broken Loyalty means nothing when companies don't care about customers.", avatar: "https://i.pravatar.cc/150?img=49", time: "1h" },
    below: { username: "yvonne_kerry2", text: "We need a complete reset. The whole loyalty system is broken entirely.", avatar: "https://i.pravatar.cc/150?img=50", time: "24h" },
  },
];

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // Spinning wheel effect - exponential ACCELERATION (inverted)
  // Starts: slow (15 frames per change = 0.5 seconds at 30fps)
  // Ends: very fast (1 frame per change) - flying through posts
  
  const progress = frame / durationInFrames;
  
  // Exponential acceleration curve (inverse of deceleration)
  // Speed decreases exponentially (from slow to fast changes)
  const minSpeed = 1; // End: changes every frame (very fast)
  const maxSpeed = 15; // Start: changes every 0.5 seconds (slow)
  
  // Exponential decay of speed (which means exponential increase in change rate)
  // Invert the progress so it goes from maxSpeed to minSpeed
  const speedMultiplier = Math.exp((1 - progress) * Math.log(maxSpeed / minSpeed));
  const currentSpeed = minSpeed * speedMultiplier;
  
  // Calculate accumulated changes by integrating 1/speed over time
  // For inverted exponential: late frames contribute much more than early frames
  const k = Math.log(maxSpeed / minSpeed);
  const accumulatedChanges = (frame / k) * (1 - Math.exp(-k * (1 - progress)));
  
  const currentSetIndex = Math.floor(accumulatedChanges) % commentSets.length;
  const currentSet = commentSets[currentSetIndex];
  
  // No fade - instant change
  const opacity = 1;

  // Highlight the word "loyalty" in comment text
  const highlightWordInText = (text: string) => {
    const parts = text.split(new RegExp(`(${TARGET_WORD})`, 'gi'));
    return parts.map((part, i) => {
      if (part.toLowerCase() === TARGET_WORD.toLowerCase()) {
        return (
          <mark
            key={i}
            style={{
              backgroundColor: "#ffeb3b",
              color: "#000",
              padding: "2px 4px",
              fontWeight: 700,
              borderRadius: "2px",
            }}
          >
            {part}
          </mark>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        padding: "40px",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Comment above - flickers with the set */}
      <div style={{ width: "100%", maxWidth: 800, opacity }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Img
            src={currentSet.above.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#262626" }}>
                {currentSet.above.username}
              </span>
              <span style={{ fontSize: 12, color: "#8e8e8e" }}>
                {currentSet.above.time}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#262626", margin: 0, lineHeight: 1.4 }}>
              {currentSet.above.text}
            </p>
          </div>
        </div>
      </div>

      {/* Flickering comment in the center with "loyalty" highlighted */}
      <div
        style={{
          width: "100%",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Img
            src={currentSet.center.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#262626" }}>
                {currentSet.center.username}
              </span>
              <span style={{ fontSize: 12, color: "#8e8e8e" }}>
                {currentSet.center.time}
              </span>
            </div>
            <p 
              style={{ 
                fontSize: 14, 
                color: "#262626", 
                margin: 0, 
                lineHeight: 1.4,
              }}
            >
              {highlightWordInText(currentSet.center.text)}
            </p>
          </div>
        </div>
      </div>

      {/* Comment below - flickers with the set */}
      <div style={{ width: "100%", maxWidth: 800, opacity }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Img
            src={currentSet.below.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#262626" }}>
                {currentSet.below.username}
              </span>
              <span style={{ fontSize: 12, color: "#8e8e8e" }}>
                {currentSet.below.time}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#262626", margin: 0, lineHeight: 1.4 }}>
              {currentSet.below.text}
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
