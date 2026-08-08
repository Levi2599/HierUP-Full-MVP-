import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import Icon from '../../../components/ui/icons';
import { COLORS, SceneCaption } from '../HireUpProductDemo';

function Tap({ at, x, y }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + 7, at + 22], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [at, at + 18], [0.45, 1.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div className="hup-tap" style={{ left: x, top: y, opacity, transform: `scale(${scale})` }} />;
}

function TypeLine({ children, start, chars = 30 }) {
  const frame = useCurrentFrame();
  const text = String(children);
  const count = Math.floor(interpolate(frame, [start, start + chars * 2], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));
  return <>{text.slice(0, count)}</>;
}

function PhoneShell({ children }) {
  const frame = useCurrentFrame();
  const enter = spring({ frame: frame - 24, fps: 30, config: { damping: 18, stiffness: 80 } });
  return (
    <div className="screen-phone-wrap" style={{ opacity: enter, transform: `translateY(${(1 - enter) * 40}px)` }}>
      <div className="screen-phone">
        <div className="phone-hardware-notch" />
        <div className="phone-capture">{children}</div>
      </div>
    </div>
  );
}

function MobileChrome({ children, title = 'hireup-ai.vercel.app' }) {
  return (
    <div className="mobile-capture-page" dir="rtl">
      <div className="mobile-ios-status"><b>9:41</b><span>5G</span></div>
      <div className="mobile-address" dir="ltr">
        <Icon name="lock" size={12} />
        {title}
      </div>
      {children}
    </div>
  );
}

function MobileLogin() {
  return (
    <MobileChrome>
      <div className="mobile-auth-card">
        <div className="mobile-brand">Hire<span>Up</span></div>
        <h3>ברוך שובך</h3>
        <p>התחבר כדי לגשת לסימולטור הראיונות.</p>
        <div className="mobile-tabs"><b>כניסה</b><span>יצירת חשבון</span></div>
        <label>שם משתמש או אימייל</label>
        <div className="mobile-input">guest@hireup.ai</div>
        <label>סיסמה</label>
        <div className="mobile-input muted">••••••••</div>
        <button>כניסה</button>
        <div className="guest-role">
          <span className="selected"><Icon name="user" size={15} /> מועמד</span>
          <span><Icon name="briefcase" size={15} /> מגייס</span>
        </div>
        <button className="ghost">המשך כאורח</button>
      </div>
    </MobileChrome>
  );
}

function MobileDashboard() {
  return (
    <MobileChrome>
      <div className="mobile-app-nav">
        <div className="mobile-brand small">Hire<span>Up</span></div>
        <Icon name="menu" size={22} />
      </div>
      <section className="mobile-empty-state">
        <Icon name="barChart" size={42} />
        <h3>אין התקדמות עדיין</h3>
        <p>השלם סימולציית ראיון ראשונה כדי לראות ניתוח ביצועים.</p>
        <button>התחל סימולציה ראשונה</button>
      </section>
    </MobileChrome>
  );
}

function MobileUpload({ frame }) {
  const cv = frame > 260;
  const jd = frame > 330;
  return (
    <MobileChrome>
      <div className="mobile-app-nav">
        <div className="mobile-brand small">Hire<span>Up</span></div>
        <Icon name="menu" size={22} />
      </div>
      <div className="mini-stepper">
        <b>העלאה</b><span>שאלה</span><span>תשובה</span><span>משוב</span>
      </div>
      <h2 className="mobile-page-title">סימולציית ראיון</h2>
      <div className={`upload-mini-card ${cv ? 'done' : ''}`}>
        <strong><Icon name="file" size={17} /> קורות חיים</strong>
        <p>{cv ? 'הקובץ עובד בהצלחה' : 'גרור קובץ או לחץ לבחירה'}</p>
      </div>
      <div className={`upload-mini-card ${jd ? 'done' : ''}`}>
        <strong><Icon name="briefcase" size={17} /> תיאור משרה</strong>
        <p>{jd ? 'Product Analyst · SaaS' : 'הדבק תיאור משרה'}</p>
      </div>
      <label className="mobile-check"><span /> זכור לסשן הבא</label>
      <button className="mobile-main-action">התחל סימולציית ראיון</button>
    </MobileChrome>
  );
}

function MobileInterview({ frame }) {
  const width = interpolate(frame, [445, 560], [0, 92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.45, 1]);
  return (
    <MobileChrome>
      <div className="mobile-app-nav">
        <div><b>סימולציית ראיון</b><small>תור 1 · STAR</small></div>
        <button className="exit-mini">יציאה</button>
      </div>
      <div className="mini-stepper active-3">
        <span>העלאה</span><b>שאלה</b><b>תשובה</b><span>משוב</span>
      </div>
      <div className="mobile-question">
        <span>מראיין AI</span>
        <p>ספרי על פרויקט שבו השתמשת בדאטה כדי להשפיע על החלטת מוצר.</p>
      </div>
      <div className="mobile-recording">
        <i style={{ opacity: pulse }} />
        <span>מקליט</span>
        <b>0:18</b>
      </div>
      <div className="mobile-answer-area">
        <label>תשובתך</label>
        <p>
          <TypeLine start={440}>
            במצב שבו ראינו ירידה בהמרות, ניתחתי את הפאנל והובלתי שינוי בתהליך onboarding.
          </TypeLine>
        </p>
        <em><strong style={{ width: `${width}%` }} /></em>
      </div>
      <button className="mobile-main-action">הגש תשובה</button>
    </MobileChrome>
  );
}

function MobileFeedback() {
  return (
    <MobileChrome>
      <div className="mobile-feedback-head">
        <span>משוב מאמן AI</span>
        <strong>86/100</strong>
      </div>
      {[
        ['מצב', 92, COLORS.success],
        ['משימה', 82, COLORS.primary],
        ['פעולה', 88, COLORS.primary],
        ['תוצאה', 78, '#f59e0b'],
      ].map(([label, value, color]) => (
        <div className="mobile-score" key={label}>
          <div><span>{label}</span><b>{value}/100</b></div>
          <em><i style={{ width: `${value}%`, background: color }} /></em>
        </div>
      ))}
      <div className="mobile-tip">
        <Icon name="target" size={18} />
        <p>הוסיפי תוצאה מספרית לסיום חזק יותר.</p>
      </div>
      <button className="mobile-main-action">המשך לשאלה הבאה</button>
    </MobileChrome>
  );
}

function CandidateScreen() {
  const frame = useCurrentFrame();
  if (frame < 150) return <MobileLogin />;
  if (frame < 245) return <MobileDashboard />;
  if (frame < 410) return <MobileUpload frame={frame} />;
  if (frame < 640) return <MobileInterview frame={frame} />;
  return <MobileFeedback />;
}

export function CandidateScene({ includeCaptions }) {
  const frame = useCurrentFrame();
  const heading = spring({ frame: frame - 72, fps: 30, config: { damping: 18, stiffness: 90 } });

  return (
    <AbsoluteFill>
      <div className="screen-demo-title" dir="rtl" style={{ opacity: heading }}>
        <span className="eyebrow">מרואיין · iPhone</span>
        <h2>התנסות אמיתית מהנייד</h2>
        <p>כניסה, העלאת קבצים, תשובה ומשוב בתוך הזרימה של האתר.</p>
      </div>
      <PhoneShell>
        <CandidateScreen />
        <Tap at={126} x={213} y={738} />
        <Tap at={224} x={210} y={597} />
        <Tap at={285} x={178} y={338} />
        <Tap at={350} x={182} y={457} />
        <Tap at={400} x={214} y={728} />
        <Tap at={596} x={214} y={732} />
      </PhoneShell>
      <div className="screen-flow" dir="rtl">
        {['כניסה', 'דשבורד', 'העלאה', 'ראיון', 'משוב'].map((label, index) => (
          <span key={label} className={frame > [80, 150, 245, 410, 640][index] ? 'active' : ''}>{label}</span>
        ))}
      </div>
      {includeCaptions && (
        <>
          <SceneCaption text="כניסה כאורח מועמד" frameStart={90} frameEnd={165} />
          <SceneCaption text="מתחילים סימולציה" frameStart={170} frameEnd={250} />
          <SceneCaption text="מעלים קורות חיים ומשרה" frameStart={255} frameEnd={405} />
          <SceneCaption text="עונים לשאלת הראיון" frameStart={420} frameEnd={620} />
          <SceneCaption text="מקבלים משוב מידי" frameStart={650} frameEnd={835} />
        </>
      )}
    </AbsoluteFill>
  );
}
