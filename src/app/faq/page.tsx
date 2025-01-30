import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const FaqPage = () => {
  return (
    <main className="p-2 pb-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              What is osu!mania?
            </h2>
            <p className="mt-3 text-muted-foreground">
              <Link
                href={"https://osu.ppy.sh/"}
                className="text-primary focus-within:underline hover:underline"
                target="_blank"
                prefetch={false}
              >
                osu!
              </Link>{" "}
              is a popular rhythm game with 4 gameplay modes: osu!, osu!taiko,
              osu!catch, and osu!mania. osu!mania is a piano-like mode inspired
              by classic rhythm games such as Dance Dance Revolution and
              Beatmania, where players must hit scrolling notes in time with the
              music. Web osu!mania ports this gamemode to the browser so that
              players may enjoy the game without having to download it or any
              beatmap levels beforehand.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              How do I play?
            </h2>
            <p className="mt-3 text-muted-foreground">
              In osu!mania, notes scroll down from the top of the screen towards
              the judgement line. The objective is to press the corresponding
              key when each note reaches the line. For long notes, you must hold
              down the corresponding key and release when the note's tail passes
              the judgement line. Points are awarded based on the accuracy of
              your timing.
            </p>
            <p className="mt-3 text-muted-foreground">
              The controls can be found inside the keybinds tab. By default, it
              uses the home row of a QWERTY keyboard.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              Is there touchscreen/gamepad support?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Yes! You can just tap on the lanes if you're using a touchscreen.
              For gamepads, go to the controls at the bottom of the keybinds tab
              and set your gamepad's keybinds before playing.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              What skins are used?
            </h2>
            <p className="mt-3 text-muted-foreground">
              The skins are drawn dynamically using a graphics library, so
              unfortunately it's not possible to bring them to the official osu.
              However, while the circle, arrow, and diamond skins are my own
              design, the bar skin is based on{" "}
              <Link
                href={"https://osu.ppy.sh/community/forums/topics/1458549?n=1"}
                className="text-primary focus-within:underline hover:underline"
                target="_blank"
                prefetch={false}
              >
                Miketacular
              </Link>
              . The judgement elements are from{" "}
              <Link
                href={"https://osu.ppy.sh/community/forums/topics/1498492?n=1"}
                className="text-primary focus-within:underline hover:underline"
                target="_blank"
                prefetch={false}
              >
                Azure Snowfall
              </Link>
              .
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              I found a bug / I have a suggestion!
            </h2>
            <p className="mt-3 text-muted-foreground">
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

        <p className="mt-4 text-muted-foreground">
          Website made with 💗 by{" "}
          <Link
            href={"https://github.com/HecticKiwi"}
            className="text-primary focus-within:underline hover:underline"
            target="_blank"
            prefetch={false}
          >
            HecticKiwi
          </Link>
        </p>
        <p className="mt-1 text-muted-foreground">
          If you like this website, please consider donating on{" "}
          <Link
            href={"https://ko-fi.com/hectickiwi"}
            className="text-primary focus-within:underline hover:underline"
            target="_blank"
            prefetch={false}
          >
            Ko-fi
          </Link>
        </p>
      </div>
    </main>
  );
};

export default FaqPage;
