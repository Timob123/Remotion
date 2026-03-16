import { Img, useVideoConfig } from "remotion";
import { Stargazer } from "./cache";
import { RepoHeader } from "./repo-header";

const W = 1280 / 2.5;
const H = 720 / 2.5;

export function Content({
  stargazers,
  repoOrg,
  repoName,
  progress,
}: {
  readonly stargazers: Stargazer[];
  readonly repoOrg: string;
  readonly repoName: string;
  readonly progress: number;
}) {
  const gap = 102;
  const startY = 76 - gap;
  const dy = progress * gap;
  const { width } = useVideoConfig();

  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c92a2a 100%)",
        position: "relative",
        maxWidth: W,
        maxHeight: H,
        minHeight: H,
        transformOrigin: "top left",
        transform: `scale(${width / W})`,
      }}
    >
      {stargazers.map((stargazer, index) => {
        const isHidden = Math.abs(index - progress) > 3;
        const grow = 0;
        const opacity = Math.min(0.1 + progress - index, 1);
        return isHidden ? null : (
          <StarBox
            key={stargazer.login}
            avatarUrl={stargazer.avatarUrl}
            name={stargazer.name}
            date={stargazer.date}
            repoName={repoName}
            y={startY - gap * index + dy}
            grow={grow}
            opacity={opacity}
            starNumber={index + 1}
          />
        );
      })}

      <RepoHeader stars={Math.round(progress)} org={repoOrg} name={repoName} />
    </div>
  );
}

function StarBox({
  avatarUrl,
  name,
  date,
  repoName,
  y,
  starNumber,
  grow,
  opacity,
}: {
  readonly avatarUrl: string;
  readonly name: string;
  readonly date: string;
  readonly repoName: string;
  readonly y: number;
  readonly starNumber: number;
  readonly grow: number;
  readonly opacity: number;
}) {
  const d = new Date(date);
  const dateString = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        border: "2px solid #ff4757",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        position: "absolute",
        opacity,
        top: 0,
        right: 24,
        left: 24,
        height: 88,
        minHeight: 88,
        maxHeight: 88,
        transform: `translateY(${y}px) scale(${1 + grow * 0.07})`,
        boxShadow: "0 4px 12px rgba(238, 90, 111, 0.3)",
      }}
    >
      <Img
        width="64"
        height="64"
        src={avatarUrl}
        style={{ borderRadius: "50%" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "12px",
          flex: 1,
          maxWidth: 560,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 360,
            fontWeight: 600,
            color: "#2d3436",
            fontSize: "16px",
          }}
        >
          {name}
        </h3>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#636e72",
            fontSize: "14px",
          }}
        >
          <span style={{ color: "#ee5a6f", fontWeight: 600 }}>fed up with</span> <b style={{ color: "#2d3436" }}>{repoName}</b>{" "}
          <span style={{ color: "#95a5a6" }}>on {dateString}</span>
        </div>
      </div>
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <span style={{ fontSize: "0.7em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Done</span>
        <div style={{ fontSize: "1.4em", fontWeight: 700 }}>
          #{starNumber}
        </div>
      </div>
    </div>
  );
}
