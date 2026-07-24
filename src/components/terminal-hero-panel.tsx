"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TerminalWindow } from "@/components/terminal-window";

export function TerminalHeroPanel() {
  const t = useTranslations("terminal");
  const p = useTranslations("hero");

  const rows = [
    { cmd: t("whoami"), out: t("whoamiOut") },
    { cmd: t("stack"), out: t("stackOut") },
    { cmd: t("status"), out: t("statusOut") },
  ];

  return (
    <TerminalWindow title={p("promptLabel")} className="w-full max-w-lg">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.cmd}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.35, duration: 0.4, ease: "easeOut" }}
          >
            <p>
              <span className="text-terminal-green">$</span>{" "}
              <span className="text-foreground">{row.cmd}</span>
            </p>
            <p className="pl-4 text-muted-foreground">{row.out}</p>
          </motion.div>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 + rows.length * 0.35 }}
          className="pt-1"
        >
          <span className="text-terminal-green">$</span>{" "}
          <span className="terminal-cursor text-terminal-green">▍</span>
        </motion.p>
      </div>
    </TerminalWindow>
  );
}
