import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const FaqPage = () => {
  return (
    <main className="p-2 sm:p-6">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            What is osu!mania?
          </h2>
          <p className="mt-3">
            <Link
              href={"https://osu.ppy.sh/"}
              className="text-primary focus-within:underline hover:underline"
              target="_blank"
              prefetch={false}
            >
              osu!
            </Link>{" "}
            is a popular rhythm game with 4 gameplay modes: osu!, osu!taiko,
            osu!catch, and osu!mania. osu!mania is a piano-like mode inspired by
            classic rhythm games such as Dance Dance Revolution and Beatmania,
            where players must hit scrolling notes in time with the music. Web
            osu!mania ports this gamemode to the browser so that players may
            enjoy the game without having to download it or any beatmap levels
            beforehand.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight">
            How do I play?
          </h2>
          <p className="mt-3">
            In osu!mania, notes scroll down from the top of the screen towards
            the judgement line. The objective is to press the corresponding key
            when each note reaches the line. For long notes, you must hold down
            the corresponding key and release when the note's tail passes the
            judgement line. Points are awarded based on the accuracy of your
            timing.
          </p>
          <p className="mt-3">
            The controls can be found at the bottom of the settings tab. By
            default, it uses the home row of a QWERTY keyboard.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight">
            I found a bug / I have a suggestion!
          </h2>
          <p className="mt-3">
            Please file an issue on{" "}
            <Link
              href={"https://github.com/HecticKiwi/Web-Osu-Mania/issues/new"}
              className="text-primary focus-within:underline hover:underline"
              target="_blank"
              prefetch={false}
            >
              GitHub
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default FaqPage;
