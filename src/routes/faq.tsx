import TextLink from "@/components/textLink";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-2 pb-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground">
          Website made with 💗 by{" "}
          <TextLink to={"https://github.com/HecticKiwi"} target="_blank">
            HecticKiwi
          </TextLink>
        </p>

        <p className="text-muted-foreground mt-1">
          If you like this website, please consider becoming a{" "}
          <TextLink to="https://github.com/sponsors/HecticKiwi" target="_blank">
            GitHub Sponsor
          </TextLink>
        </p>

        <Card className="mt-4">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              What is osu!mania?
            </h2>
            <p className="text-muted-foreground mt-3">
              <TextLink to={"https://osu.ppy.sh/"} target="_blank">
                osu!
              </TextLink>{" "}
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
            <p className="text-muted-foreground mt-3">
              In osu!mania, notes scroll down from the top of the screen towards
              the judgement line. The objective is to press the corresponding
              key when each note reaches the line. For long notes, you must hold
              down the corresponding key and release when the note's tail passes
              the judgement line. Points are awarded based on the accuracy of
              your timing.
            </p>
            <p className="text-muted-foreground mt-3">
              The controls can be found in the keybinds tab. By default, it uses
              the home row of a QWERTY keyboard.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              Is there touchscreen/gamepad support?
            </h2>
            <p className="text-muted-foreground mt-3">
              Yes! You can just tap on the lanes if you're using a touchscreen.
              For gamepads, go to the keybinds tab and set your gamepad's
              keybinds before playing.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              What skins are used?
            </h2>
            <p className="text-muted-foreground mt-3">
              The skins are drawn dynamically using a graphics library, so
              unfortunately it's not possible to bring them to the official osu.
              However, while the circle, arrow, and diamond skins are my own
              design, the bar skin is based on{" "}
              <TextLink
                to={"https://osu.ppy.sh/community/forums/topics/1458549?n=1"}
                target="_blank"
              >
                Miketacular
              </TextLink>
              . The judgement elements are from{" "}
              <TextLink
                to={"https://osu.ppy.sh/community/forums/topics/1498492?n=1"}
                target="_blank"
              >
                Azure Snowfall
              </TextLink>
              .
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              The site is blocked on my network!
            </h2>
            <p className="text-muted-foreground mt-3">
              If you’re unable to access the site due to network restrictions
              (e.g. school or workplace firewalls), you can try one of the
              following mirror URLs:
            </p>
            <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-1">
              <li>
                <TextLink to={"https://webosumania.com"} target="_blank">
                  https://webosumania.com
                </TextLink>{" "}
                (main)
              </li>
              <li>
                <TextLink
                  to={"https://webosumania.hectickiwi.workers.dev"}
                  target="_blank"
                >
                  https://webosumania.hectickiwi.workers.dev
                </TextLink>
              </li>
              <li>
                <TextLink
                  to={"https://hectickiwi.github.io/Web-Osu-Mania"}
                  target="_blank"
                >
                  https://hectickiwi.github.io/Web-Osu-Mania
                </TextLink>
              </li>
              <li>
                <TextLink to={"https://wom.slingexe.com"} target="_blank">
                  https://wom.slingexe.com
                </TextLink>{" "}
                (Old Version)
              </li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight">
              I found a bug / I have a suggestion!
            </h2>
            <p className="text-muted-foreground mt-3">
              Please file an issue on{" "}
              <TextLink
                to={"https://github.com/HecticKiwi/Web-Osu-Mania/issues/new"}
                target="_blank"
              >
                GitHub
              </TextLink>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
