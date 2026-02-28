import { FaqSection } from "@/components/faq/faqSection";
import { Footer } from "@/components/footer";
import TextLink from "@/components/textLink";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookText,
  Bug,
  Globe,
  HelpCircle,
  Keyboard,
  Paintbrush,
} from "lucide-react";
import type { ReactNode } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

const gameplayFaq: FaqItem[] = [
  {
    question: "What is osu!mania?",
    answer: (
      <div className="flex flex-col gap-3">
        <p>
          <TextLink to={"https://osu.ppy.sh"} target="_blank">
            osu!
          </TextLink>{" "}
          is a popular rhythm game with 4 gameplay modes: osu!, osu!taiko,
          osu!catch, and osu!mania. osu!mania is a piano-like mode inspired by
          classic rhythm games such as Dance Dance Revolution and Beatmania,
          where players must hit scrolling notes in time with the music.
        </p>
        <p>
          Web osu!mania ports this gamemode to the browser so that players may
          enjoy the game without having to download it or any beatmap levels
          beforehand.
        </p>
      </div>
    ),
  },
  {
    question: "How do I play?",
    answer: (
      <div className="flex flex-col gap-3">
        <p>
          In osu!mania, notes scroll down from the top of the screen towards the
          judgement line. The objective is to press the corresponding key when
          each note reaches the line. For long notes, you must hold down the
          corresponding key and release when the note's tail passes the
          judgement line. Points are awarded based on the accuracy of your
          timing.
        </p>
        <p>
          The controls can be found in the keybinds tab. By default, it uses the
          home row of a QWERTY keyboard.
        </p>
      </div>
    ),
  },
  {
    question: "How do I use the .womr replay file format?",
    answer: (
      <div className="flex flex-col gap-3">
        <p>
          "womr" stands for <b>W</b>eb <b>o</b>su!<b>m</b>ania <b>R</b>eplay.
          It's a propreitary file format used by the site to store replay data.
          It can't be directly opened like an MP4 - you watch it by loading the
          file in the settings under Replays.
        </p>
      </div>
    ),
  },
];

const controlsFaq: FaqItem[] = [
  {
    question: "Is there touchscreen or gamepad support?",
    answer: (
      <p>
        Yes! You can just tap on the lanes if you're using a touchscreen. For
        gamepads, go to the keybinds tab and set your gamepad's keybinds before
        playing.
      </p>
    ),
  },
];

const customizationFaq: FaqItem[] = [
  {
    question: "What skins are used?",
    answer: (
      <p>
        The skins are drawn dynamically using a graphics library, so
        unfortunately it's not possible to bring them to the official osu.
        However, while the circle, arrow, and diamond skins are my own design,
        the bar skin is based on{" "}
        <TextLink
          to={"https://osu.ppy.sh/community/forums/topics/1458549?n=1"}
          target="_blank"
        >
          Miketacular
        </TextLink>
        . Sources for the judgment images can be found in the settings
        underneath the Judgement Set field.
      </p>
    ),
  },
];

const troubleshootingFaq: FaqItem[] = [
  {
    question: "The site is blocked on my network!",
    answer: (
      <div className="flex flex-col gap-3">
        <p>
          If you're unable to access the site due to network restrictions (e.g.
          school or workplace firewalls), you can try one of the following
          mirror URLs:
        </p>
        <ul className="flex flex-col gap-1.5 pl-1">
          {[
            {
              url: "https://webosumania.com",
              label: "webosumania.com",
              note: "main",
            },
            {
              url: "https://webosumania.hectickiwi.workers.dev",
              label: "webosumania.hectickiwi.workers.dev",
            },
            {
              url: "https://hectickiwi.github.io/Web-Osu-Mania",
              label: "hectickiwi.github.io/Web-Osu-Mania",
            },
            {
              url: "https://wom.slingexe.com",
              label: "wom.slingexe.com",
              note: "old",
            },
          ].map((mirror) => (
            <li key={mirror.url} className="flex items-center gap-2">
              <span className="bg-primary/50 size-1 shrink-0 rounded-full" />
              <TextLink to={mirror.url} target="_blank">
                {mirror.label}
              </TextLink>
              {mirror.note && (
                <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">
                  {mirror.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    question: "Beatmaps / audio previews / cover images aren't loading!",
    answer: (
      <p>
        If you are experiencing issues loading a beatmap, playing audio
        previews, or viewing beatmap cover images, try changing the providers in
        the settings under Sources.
      </p>
    ),
  },
  {
    question: "I found a bug or have a suggestion.",
    answer: (
      <p>
        Please open an issue on{" "}
        <TextLink
          to={"https://github.com/HecticKiwi/Web-Osu-Mania/issues/new/choose"}
          target="_blank"
        >
          GitHub
        </TextLink>
        .
      </p>
    ),
  },
];

export const Route = createFileRoute("/faq")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "FAQ - Web osu!mania" },
      {
        name: "description",
        content: "Find answers to common questions about Web osu!mania.",
      },
      {
        name: "twitter:description",
        content: "Find answers to common questions about Web osu!mania.",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div>
      {/* Hero */}
      <div className="border-border/50 relative border-b">
        {/* Polka bg with linear fade */}
        <div className="bg-polka absolute inset-0 -z-20"></div>
        <div className="bg-background absolute inset-0 -z-10 mask-[linear-gradient(to_top,transparent,black_35%)]"></div>

        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-primary size-5" />
              <span className="text-primary text-sm font-medium tracking-widest">
                FAQ
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground leading-relaxed text-pretty md:text-lg">
              Everything you need to know about Web osu!mania. Can't find what
              you're looking for? Feel free to ask on{" "}
              <TextLink to={"https://discord.gg/8zfxCdkfTx"} target="_blank">
                Discord
              </TextLink>{" "}
              or open an issue on{" "}
              <TextLink
                to={
                  "https://github.com/HecticKiwi/Web-Osu-Mania/issues/new/choose"
                }
                target="_blank"
              >
                GitHub
              </TextLink>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-[200px_1fr] md:gap-16">
          {/* Sidebar Table of Contents */}
          <aside className="hidden md:block">
            <nav className="sticky top-24 flex flex-col gap-1">
              <span className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest">
                TOPICS
              </span>
              {[
                { label: "Gameplay", href: "#gameplay" },
                { label: "Controls", href: "#controls" },
                { label: "Customization", href: "#customization" },
                { label: "Troubleshooting", href: "#troubleshooting" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ Sections */}
          <div className="flex flex-col gap-12">
            <div id="gameplay" className="scroll-mt-20">
              <FaqSection
                title="General"
                description="Learn the basics of Web osu!mania"
                icon={<BookText className="size-5" />}
                items={gameplayFaq}
              />
            </div>

            <div id="controls" className="scroll-mt-20">
              <FaqSection
                title="Controls"
                description="Input methods and keybinds"
                icon={<Keyboard className="size-5" />}
                items={controlsFaq}
              />
            </div>

            <div id="customization" className="scroll-mt-20">
              <FaqSection
                title="Customization"
                description="Skins and visual themes"
                icon={<Paintbrush className="size-5" />}
                items={customizationFaq}
              />
            </div>

            <div id="troubleshooting" className="scroll-mt-20">
              <FaqSection
                title="Troubleshooting"
                description="Common issues and how to resolve them"
                icon={<Bug className="size-5" />}
                items={troubleshootingFaq}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-border/50 bg-card border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-12 text-center md:py-16">
          <Globe className="text-primary size-8" />
          <h2 className="text-xl font-semibold tracking-tight">
            Still have questions?
          </h2>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Ask in our Discord server or open an issue on GitHub. We're always
            happy to help.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <a
              href="https://discord.gg/8zfxCdkfTx"
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <FaDiscord className="h-5 w-5" />
              Discord
            </a>
            <a
              href="https://github.com/sponsors/HecticKiwi"
              target="_blank"
              rel="noreferrer"
              className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <FaGithub className="h-5 w-5" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
