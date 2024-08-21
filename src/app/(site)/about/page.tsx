/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="mx-auto mt-12 max-w-2xl">
      <h1 className="inline-block text-2xl font-semibold tracking-tight">
        What is this?
      </h1>
      <p className="mt-3">
        <Link
          href={"https://osu.ppy.sh/"}
          className="text-primary focus-within:underline hover:underline"
        >
          Osu!
        </Link>{" "}
        is a popular rhythm game with 4 gameplay modes: Standard, Taiko, Catch,
        and Mania. Web Osu! Mania aims to port the Mania gamemode to the browser
        so that players may enjoy the game without having to download it or any
        beatmap levels beforehand.
      </p>

      <h1 className="mt-8 inline-block text-2xl font-semibold tracking-tight">
        How do I play?
      </h1>
      <p className="mt-3">
        In Osu Mania, notes scroll down from the top of the screen towards the
        judgement line, which sits just above the keys at the bottom of the
        screen. The objective is to press the corresponding key when each note
        reaches the judgement line. For long notes, you must hold down the
        corresponding key and release once the note's tail passes the judgement
        line.
      </p>

      <h1 className="mt-8 inline-block text-2xl font-semibold tracking-tight">
        What skin does this site use?
      </h1>
      <p className="mt-3">
        It uses{" "}
        <Link
          href={"https://osu.ppy.sh/community/forums/topics/1498492"}
          className="text-primary focus-within:underline hover:underline"
        >
          Azure Snowfall
        </Link>
        . The decision to use this skin was somewhat arbitrary as I only needed
        something that fit the colors of the site.
      </p>
    </main>
  );
};

export default AboutPage;
