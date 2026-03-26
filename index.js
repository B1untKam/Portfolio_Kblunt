// ===== FOOTER =====
const footer = document.querySelector('footer');
const thisYear = new Date().getFullYear();
footer.innerHTML = `<p>Kamalia Blunt &copy; ${thisYear} &mdash; Designed with <a href="https://claude.ai" target="_blank" style="color: var(--accent); text-decoration: none;">Claude AI</a>, built with JavaScript, curiosity, and a growth mindset.</p>`;

// ===== ANIMATED STAT COUNTER =====
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 1500;
                const start = performance.now();
                
                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * ease);
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                }
                
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

animateCounters();

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(s => s.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08 });
    
    sections.forEach(section => observer.observe(section));
}

initScrollReveal();

// ===== NAV ACTIVE STATE =====
function initNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('main section[id]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    
    sections.forEach(section => observer.observe(section));
}

initNavHighlight();

// ===== AI PROMPT LAB =====
const prompts = {
    business: {
        scenario: "A local bakery owner wants to use AI to manage inventory but doesn't know where to start. They're skeptical that AI is \"only for big companies.\"",
        prompt: `You are an inventory management assistant for a small bakery called "Sweet Rise" that sells 15 types of baked goods. 

Your job: Analyze the last 30 days of sales data I'll provide and give me:
1. Which 3 items I'm overproducing (waste)
2. Which 3 items I should make more of (missed sales)
3. A suggested daily production schedule for next week

Important context:
- We're a 2-person team, so keep suggestions realistic
- Weekend sales are 2x weekday volume  
- We can only bake 150 total items per day
- Format your response as a simple table I can print and tape to the wall

Here's my sales data: [paste data]`,
        rationale: "This prompt works because it gives the AI a specific role, provides clear constraints (team size, capacity limits), asks for actionable output in a practical format, and accounts for real-world patterns like weekend surges. It shows the bakery owner that AI isn't magic — it's a tool that works best with good instructions and real data."
    },
    data: {
        scenario: "A program manager needs to analyze survey responses from 200+ employees to identify themes around workplace satisfaction, but doesn't have time to read each one individually.",
        prompt: `Analyze the following open-ended survey responses about workplace satisfaction.

For each response, categorize it into:
- Primary theme (choose from: Leadership, Communication, Work-Life Balance, Growth Opportunities, Compensation, Team Dynamics, Tools & Resources)
- Sentiment (Positive / Neutral / Negative)
- Action priority (High / Medium / Low)

Then provide:
1. A summary table showing theme frequency and average sentiment
2. Top 3 urgent themes that need leadership attention
3. Direct quotes (anonymized) that best represent each major theme
4. 2-3 recommended next steps based on the data

Format as a structured report I can present to division leadership. Use clear headers and keep language professional but accessible.

Survey responses: [paste responses]`,
        rationale: "This prompt turns unstructured qualitative data into an executive-ready report. It defines the taxonomy upfront (preventing the AI from creating inconsistent categories), requests both quantitative summary and qualitative evidence, and specifies the audience. The 'action priority' field ensures the output is decision-oriented, not just descriptive."
    },
    nonprofit: {
        scenario: "A community health nonprofit wants to write a grant application but their small team has never used AI for writing assistance. They're worried it will sound 'robotic.'",
        prompt: `You are helping a small community health nonprofit draft a grant narrative. Your role is collaborative editor — NOT the author. 

I'll provide our rough notes and you'll help us:
1. Organize them into the funder's required format (see below)
2. Strengthen language while keeping our authentic voice
3. Flag any claims that need data/citations to back them up
4. Suggest where to add community quotes or stories for impact

Rules:
- Preserve our conversational, community-centered tone
- Don't use jargon like "synergize" or "leverage" — our community partners won't connect with that
- Keep paragraphs short (3-4 sentences max)
- Highlight in [BRACKETS] any section where you think we need more specific data

Funder's required sections:
- Statement of Need
- Program Design  
- Expected Outcomes
- Sustainability Plan

Our rough notes: [paste notes]`,
        rationale: "This prompt addresses the #1 fear nonprofits have about AI: losing their voice. By defining AI as a 'collaborative editor' rather than author, it preserves authenticity. The explicit rules about tone and jargon keep the output grounded. The bracket convention for missing data turns AI into a QA partner, not just a writing tool."
    },
    training: {
        scenario: "A manager needs to onboard 5 new team members on a complex internal process, but the existing training documentation is 47 pages long and outdated.",
        prompt: `I'm going to paste a 47-page internal process document. Help me transform it into a modern onboarding kit.

Create the following deliverables:

1. ONE-PAGE QUICK START GUIDE
   - The 5 most critical steps a new hire needs on Day 1
   - Format: numbered checklist with brief descriptions
   
2. FAQ DOCUMENT (max 2 pages)
   - Anticipate the top 10 questions a new hire would ask
   - Write answers in plain language (assume no prior knowledge)
   
3. PROCESS FLOW SUMMARY
   - Describe the end-to-end process in 8 steps or fewer
   - For each step: Who does it → What they do → Where it goes next
   
4. FLAG OUTDATED CONTENT
   - List any instructions that reference specific software versions, dates, or contacts that may need updating
   - Mark with [VERIFY] tag

Keep everything scannable: use headers, bullets, and bold for key terms. New hires should be able to find any answer in under 30 seconds.

Document: [paste document]`,
        rationale: "This prompt transforms a common pain point (outdated, bloated documentation) into four distinct, usable deliverables. The '30-second find' constraint forces conciseness. The [VERIFY] convention turns AI into an audit tool for stale content. Each deliverable has a clear format spec, so the output is immediately usable — no reformatting needed."
    }
};

function initPromptLab() {
    const tabs = document.querySelectorAll('.prompt-tab');
    const scenario = document.getElementById('prompt-scenario');
    const text = document.querySelector('#prompt-text code');
    const rationale = document.getElementById('prompt-rationale');
    
    function showPrompt(key) {
        const data = prompts[key];
        if (!data) return;
        
        scenario.textContent = data.scenario;
        text.textContent = data.prompt;
        rationale.textContent = data.rationale;
        
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-prompt="${key}"]`).classList.add('active');
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showPrompt(tab.getAttribute('data-prompt'));
        });
    });
    
    // Show first prompt by default
    showPrompt('business');
}

initPromptLab();

// ===== CONTACT FORM =====
const messageForm = document.querySelector('form[name="leave_message"]');
const messageList = document.getElementById('messageList');

messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = event.target.usersName.value;
    const email = event.target.usersEmail.value;
    const message = event.target.usersMessage.value;
    
    const li = document.createElement('li');
    li.innerHTML = `<a href="mailto:${email}">${name}</a> <span>${message}</span>`;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✕';
    removeBtn.type = 'button';
    removeBtn.addEventListener('click', () => li.remove());
    
    li.appendChild(removeBtn);
    messageList.appendChild(li);
    messageForm.reset();
});
