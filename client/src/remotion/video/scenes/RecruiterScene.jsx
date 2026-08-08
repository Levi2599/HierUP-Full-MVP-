import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import Icon from '../../../components/ui/icons';
import { SceneCaption } from '../HireUpProductDemo';

function Cursor({ at, from = [590, 420], to = [920, 510] }) {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [at - 12, at, at + 72], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const move = interpolate(frame, [at, at + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const click = interpolate(frame, [at + 46, at + 52, at + 60], [1, 0.84, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      className="desktop-cursor"
      style={{
        opacity: appear,
        left: from[0] + (to[0] - from[0]) * move,
        top: from[1] + (to[1] - from[1]) * move,
        transform: `scale(${click}) rotate(20deg)`,
      }}
    >
      <Icon name="arrowRight" size={32} />
    </div>
  );
}

function TypeValue({ text, start }) {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [start, start + text.length * 2], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  return <>{text.slice(0, chars)}</>;
}

function BrowserFrame({ children }) {
  return (
    <div className="real-browser">
      <div className="real-browser-bar" dir="ltr">
        <i /><i /><i />
        <span><Icon name="lock" size={13} /> hireup-ai.vercel.app</span>
      </div>
      <div className="real-browser-page" dir="rtl">{children}</div>
    </div>
  );
}

function LoginScreen({ frame }) {
  return (
    <BrowserFrame>
      <div className="desktop-login">
        <div className="desktop-login-brand">
          <div className="mobile-brand">Hire<span>Up</span></div>
          <h1>עלה רמה<br />בראיון הבא שלך</h1>
          <p>תרגול ראיונות וכלים למגייסים.</p>
        </div>
        <div className="desktop-login-card">
          <h2>ברוך שובך</h2>
          <p>התחבר לחשבונך או המשך כאורח.</p>
          <div className="mobile-tabs"><b>כניסה</b><span>יצירת חשבון</span></div>
          <label>בחר את תפקידך</label>
          <div className="role-choice"><span>מועמד</span><b>מגייס</b></div>
          <label>שם משתמש או אימייל</label>
          <div className="desktop-input"><TypeValue text="recruiter@hireup.ai" start={40} /></div>
          <button>המשך כאורח</button>
        </div>
      </div>
    </BrowserFrame>
  );
}

function RecruiterDashboard() {
  return (
    <BrowserFrame>
      <div className="app-topbar">
        <div className="mobile-brand small">Hire<span>Up</span></div>
        <nav><b>לוח בקרה למגייס</b><span>מחולל שאלות</span></nav>
        <button>עבור למועמד</button>
      </div>
      <main className="desktop-app-main">
        <header className="desktop-page-head">
          <div><h2>לוח בקרה למגייס</h2><p>נהל מדריכי ראיון ותבניות שאלות שנוצרו.</p></div>
          <button>צור מדריך חדש</button>
        </header>
        <section className="desktop-kpis">
          <div><span>מדריכי משרות פעילות</span><strong>3</strong><p>מדריכים שמורים</p></div>
          <div><span>מאגר שאלות</span><strong>18</strong><p>שאלות מוכנות לשימוש</p></div>
          <div><span>זמן הכנה שנחסך</span><strong>4.5 שעות</strong><p>לפי מדריכים קיימים</p></div>
        </section>
        <section className="guide-table">
          <h3>מדריכי ראיון פעילים</h3>
          {[
            ['Frontend Developer', 'SaaS', 'Mid Profile', 6],
            ['Product Analyst', 'FinTech', 'Mid Profile', 5],
            ['Customer Success', 'B2B', 'Junior Track', 7],
          ].map((row) => (
            <div className="guide-row" key={row[0]}>
              <b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em><strong>{row[3]}</strong><button>PDF</button>
            </div>
          ))}
        </section>
      </main>
    </BrowserFrame>
  );
}

function QuestionGenerator({ frame }) {
  const generated = frame > 360;
  const basket = frame > 520;
  return (
    <BrowserFrame>
      <div className="app-topbar">
        <div className="mobile-brand small">Hire<span>Up</span></div>
        <nav><span>לוח בקרה למגייס</span><b>מחולל שאלות</b></nav>
        <button>עבור למועמד</button>
      </div>
      <main className="desktop-app-main">
        <header className="desktop-page-head">
          <div><h2>מחולל בנק שאלות</h2><p>צור תכניות שאלות ראיון מותאמות AI.</p></div>
          <button className="secondary">חזרה ללוח בקרה</button>
        </header>
        <section className="question-form">
          <div><label>תפקיד</label><p><TypeValue text="Product Analyst" start={150} /></p></div>
          <div><label>תעשייה</label><p><TypeValue text="SaaS" start={190} /></p></div>
          <div><label>רמת בכירות</label><p>Mid Profile</p></div>
          <div><label>מספר שאלות</label><p>5</p></div>
          <div className="wide"><label>תיאור משרה</label><p><TypeValue text="ניתוח funnels, עבודה עם SQL, שיתוף פעולה עם צוות מוצר." start={220} /></p></div>
          <button>{generated ? 'נוצרו שאלות' : 'צור שאלות'}</button>
        </section>
        {generated && (
          <section className="generated-layout">
            <div className="generated-questions">
              <h3>שאלות שנוצרו בעזרת AI</h3>
              {[
                ['התנהגותי', 'ספרי על החלטת מוצר שקידמת בעזרת נתונים.', 'STAR'],
                ['טכני', 'איך תבדקי ירידה חדה בהמרה בפאנל?', 'Step-by-Step'],
                ['התנהגותי', 'תארי מקרה של עבודה עם צוותים לא טכניים.', 'CAR'],
              ].map((q, index) => (
                <article className={basket && index === 0 ? 'picked' : ''} key={q[1]}>
                  <div><span>{q[0]}</span><em>{q[2]}</em><button>{basket && index === 0 ? <Icon name="check" size={16} /> : <Icon name="plus" size={16} />}</button></div>
                  <p>{q[1]}</p>
                </article>
              ))}
            </div>
            <aside className="basket-panel">
              <h3>סל ראיון</h3>
              <b>{basket ? '1 נבחרה' : '0 נבחרו'}</b>
              {basket ? <p>ספרי על החלטת מוצר שקידמת בעזרת נתונים.</p> : <small>לחץ + על שאלה כדי להוסיף אותה לכאן.</small>}
              <button className={basket ? 'ready' : ''}>ייצא מדריך PDF</button>
            </aside>
          </section>
        )}
      </main>
    </BrowserFrame>
  );
}

function RecruiterScreen() {
  const frame = useCurrentFrame();
  if (frame < 120) return <LoginScreen frame={frame} />;
  if (frame < 300) return <RecruiterDashboard />;
  return <QuestionGenerator frame={frame} />;
}

export function RecruiterScene({ includeCaptions }) {
  const frame = useCurrentFrame();
  const enter = spring({ frame: frame - 10, fps: 30, config: { damping: 18, stiffness: 80 } });

  return (
    <AbsoluteFill>
      <div className="screen-demo-title desktop" dir="rtl" style={{ opacity: enter }}>
        <span className="eyebrow">מראיין · Desktop</span>
        <h2>ניהול ראיון מתוך הדשבורד</h2>
        <p>כניסה כמגייס, צפייה במדריכים, יצירת שאלות וייצוא מדריך.</p>
      </div>
      <div className="desktop-recording-stage" style={{ opacity: enter, transform: `translateY(${(1 - enter) * 26}px) scale(${0.95 + enter * 0.05})` }}>
        <RecruiterScreen />
      </div>
      <Cursor at={76} from={[1070, 700]} to={[1175, 736]} />
      <Cursor at={210} from={[920, 360]} to={[1260, 309]} />
      <Cursor at={328} from={[980, 400]} to={[954, 542]} />
      <Cursor at={462} from={[1030, 716]} to={[951, 850]} />
      <Cursor at={584} from={[1090, 760]} to={[1406, 851]} />
      {includeCaptions && (
        <>
          <SceneCaption text="כניסה כאורח מגייס" frameStart={40} frameEnd={125} top={860} />
          <SceneCaption text="סקירת מדריכי ראיון" frameStart={135} frameEnd={300} top={860} />
          <SceneCaption text="ממלאים פרטי משרה" frameStart={315} frameEnd={440} top={860} />
          <SceneCaption text="בוחרים שאלות לסל" frameStart={460} frameEnd={600} top={860} />
          <SceneCaption text="מייצאים מדריך PDF" frameStart={610} frameEnd={760} top={860} />
        </>
      )}
    </AbsoluteFill>
  );
}
