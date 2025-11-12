import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("LandingPage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
