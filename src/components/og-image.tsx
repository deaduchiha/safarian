type OgImageProps = {
  title: string;
  description?: string;
  site?: string;
};

const primaryColor = "#c2410c";
const primaryTextColor = "#fdba74";

export function OgImage({ title, description, site }: OgImageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        padding: "64px",
        backgroundColor: "#0c0c0c",
        borderBottom: `18px solid ${primaryColor}`,
        direction: "rtl",
        fontFamily: "Arad",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: "72px",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {title}
      </p>
      {description ? (
        <p
          style={{
            fontSize: "40px",
            lineHeight: 1.4,
            color: "rgba(240,240,240,0.82)",
            margin: 0,
            marginTop: "20px",
            paddingBottom: "24px",
            borderBottom: `10px dashed ${primaryColor}`,
          }}
        >
          {description}
        </p>
      ) : null}
      {site ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            marginTop: "auto",
            color: primaryTextColor,
          }}
        >
          <p
            style={{
              fontSize: "48px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {site}
          </p>
        </div>
      ) : null}
    </div>
  );
}
