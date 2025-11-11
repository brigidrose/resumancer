// lib/mood.ts
export type Mood = 0|1|2|3|4|5|6|7|8|9|10;

export function moodProfile(mood: Mood) {
  const practical = Math.max(0, 1 - mood / 6);      // high at low mood
  const absurd = Math.max(0, (mood - 4) / 6);       // grows after ~4
  const creative = 1 - Math.abs(mood - 5) / 5;      // peaks mid

  const sum = practical + creative + absurd || 1;
  const weights = {
    practical: practical / sum,
    creative: creative / sum,
    absurd: absurd / sum,
  };

  // knobs to steer LLM behavior
  const temperature = 0.2 + (mood / 10) * 0.6;      // 0.2 → 0.8
  const scope = mood < 3 ? "tight, incremental"
              : mood < 7 ? "balanced, ambitious but feasible"
                         : "wild, moonshot, rule-bending";
  const budget = mood < 3 ? "under $500 and within 1 week"
               : mood < 7 ? "reasonable budget within 1–4 weeks"
                          : "ignore budget; optimize for spectacle";
  const risk =  mood < 3 ? "minimize risk; high feasibility"
               : mood < 7 ? "moderate risk; good upside"
                          : "accept high risk and unknowns";

  return { weights, temperature, scope, budget, risk };
}
