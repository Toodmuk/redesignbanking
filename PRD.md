# PRD: กระปุกออมสิน Smart Piggy Bank — เชื่อมต่อแอปธนาคารกรุงไทย

> **เวอร์ชัน:** 1.0  
> **วันที่:** มีนาคม 2025  
> **สถานะ:** Prototype / Hackathon Demo  
> **ทีม:** พี่เเม็คโคร

---

## 1. ภาพรวมโปรเจกต์ (Project Overview)

### ปัญหาที่แก้ (Problem Statement)
คนไทยรายได้น้อยมักไม่มีนิสัยการออม เพราะขาดเครื่องมือที่ง่าย สนุก และจูงใจพอ กระปุกออมสินทั่วไปไม่มี feedback ไม่รู้ว่าออมได้เท่าไหร่ และไม่เชื่อมกับระบบธนาคารจริง

### วิสัยทัศน์ (Vision)
กระปุกออมสิน Smart ที่เชื่อมกับแอปมือถือของกรุงไทย (Krungthai NEXT / KTB) ให้คนรายได้น้อยมีแรงจูงใจออมเงินผ่านเสียง, แสง, สถิติ และสิทธิประโยชน์

### ขอบเขต Prototype (Scope — What We Build)
> ⚠️ นี่คือ **Prototype** สำหรับ Demo เท่านั้น  
> Hardware จริง (sensor, solar cell, กล่องกระปุก) ทำโดยทีม Hardware  
> ทีมเรา (Software) สร้าง **Web App** ที่จำลองการทำงานทั้งหมด

---

## 2. ผู้ใช้งานเป้าหมาย (Target Users)

| กลุ่ม | คำอธิบาย |
|-------|----------|
| **Primary** | คนไทยรายได้น้อย อายุ 18–45 ปี ที่ต้องการเริ่มออมเงิน |
| **Secondary** | นักเรียน / นักศึกษาที่ต้องการสร้างวินัยทางการเงิน |
| **Persona** | แม่บ้าน, พนักงานรายวัน, ผู้ใช้งานที่ไม่ถนัดเทคโนโลยี |

### ข้อมูลสำคัญ
- ภาษา: **ภาษาไทยทั้งหมด** (UI, เสียง, แจ้งเตือน)
- UX ต้องง่ายมาก: ไม่ซับซ้อน, ปุ่มใหญ่, สีสดใส, ไอคอนชัดเจน
- รองรับมือถือ (Mobile-first)

---

## 3. Features ทั้งหมด (Feature List)

### 3.1 🔊 เสียงแจ้งเตือนเมื่อใส่เงิน (Core — MVP)
**คำอธิบาย:** เมื่อมีการหยอดเหรียญ/ธนบัตรเข้ากระปุก แอปจะแสดง animation และเล่นเสียง "เงินเข้าแล้ว!"

**สำหรับ Prototype:**
- มีปุ่ม **"หยอดเงิน"** ใน UI ที่ผู้ใช้กดเพื่อจำลองการใส่เงิน
- เลือกได้ว่าใส่เท่าไหร่ (เช่น 1, 5, 10 บาท หรือพิมพ์เอง)
- แสดง animation เหรียญตกลงกระปุก
- เล่นเสียง "เงินเข้าแล้ว!" (ไฟล์ .mp3 หรือ Text-to-Speech ภาษาไทย)

**Acceptance Criteria:**
- [ ] กดปุ่มแล้วได้ยินเสียงภายใน 0.5 วินาที
- [ ] ยอดเงินในกระปุกอัปเดตทันที
- [ ] animation ทำงานบนมือถือ

---

### 3.2 💰 นับเงินในกระปุก (Core — MVP)
**คำอธิบาย:** แสดงยอดเงินรวมทั้งหมดที่อยู่ในกระปุก

**สำหรับ Prototype:**
- แสดงยอดเงินแบบ Real-time
- แสดงกราฟ/progress bar สู่เป้าหมาย
- แอดมิน (ทีม) สามารถตั้งยอดเริ่มต้นได้เพื่อ Demo

**Acceptance Criteria:**
- [ ] ยอดเงินแสดงถูกต้อง
- [ ] มี progress bar แสดงความคืบหน้า

---

### 3.3 📊 สถิติการออมย้อนหลัง (Core — MVP)
**คำอธิบาย:** แสดงประวัติการออมเพื่อสร้างแรงจูงใจ

**Features:**
- กราฟแสดงการออมรายวัน / รายสัปดาห์ / รายเดือน
- จำนวนวันที่ออมต่อเนื่อง (Streak)
- เปรียบเทียบเดือนนี้ vs เดือนที่แล้ว
- ข้อความกำลังใจ เช่น "ออมมา 7 วันแล้ว! เก่งมาก 🎉"

**สำหรับ Prototype:**
- Pre-load ข้อมูลสถิติตัวอย่าง (dummy data) เพื่อ Demo
- แอดมินสามารถตั้งค่าสถิติล่วงหน้าได้

---

### 3.4 🏦 แนะนำการลงทุนและเปิดบัญชี (Core — MVP)
**คำอธิบาย:** แอปแนะนำให้ผู้ใช้เปิดบัญชีการลงทุนกับกรุงไทย

**Features:**
- แสดงการ์ด "สร้างอนาคตที่ดีกว่า — เปิดบัญชีลงทุน"
- อธิบายสั้นๆ ง่ายมาก (ไม่ใช่ศัพท์การเงิน)
- ปุ่ม "ไปสาขาใกล้บ้าน" → เปิด Google Maps หาสาขา KTB ใกล้ที่สุด
- แสดง QR Code ลิงก์ไปหน้าแนะนำกรุงไทย

**สำหรับ Prototype:**
- Mock-up หน้า landing page ของ KTB (ไม่ต้องเชื่อม API จริง)

---

### 3.5 🎁 สิทธิประโยชน์จากการออม (Nice to Have)
**คำอธิบาย:** ยิ่งออมมาก ยิ่งได้สิทธิ์มาก

**Features:**
- ระบบ Tier: ทองแดง → เงิน → ทอง → แพลตตินั่ม
- แสดงสิทธิ์ที่ได้รับตาม Tier เช่น คูปองส่วนลด, ของที่ระลึก
- Progress แสดงว่าต้องออมอีกเท่าไหร่เพื่อ unlock Tier ถัดไป

**สำหรับ Prototype:**
- แสดง Tier ปัจจุบันและสิทธิ์สมมติ (ไม่ต้องส่งของจริง)

---

### 3.6 🔔 ระบบแจ้งเตือน (Nice to Have)
**คำอธิบาย:** กระตุ้นให้ออมสม่ำเสมอ

**Types:**
- แจ้งเตือนรายวัน: "วันนี้ยังไม่ได้ออม หยอดเหรียญสักเหรียญนะ 🐷"
- แจ้งเตือนเรื่องการลงทุน: "คุณออมได้ 500 บาทแล้ว! ลองลงทุนดูไหม?"
- แจ้งเตือนเมื่อกระปุกเต็ม: "กระปุกเต็มแล้ว! ถึงเวลาไปฝากธนาคาร 🏦"

**สำหรับ Prototype:**
- In-app notification (ไม่ต้องเป็น push notification จริง)
- ปุ่มทดสอบ "จำลองกระปุกเต็ม" สำหรับ Demo

---

### 3.7 👨‍💼 Admin Panel (สำหรับ Demo)
> ฟีเจอร์นี้มีเฉพาะสำหรับ Prototype เพื่อให้ทีมควบคุม Demo ได้

**Features:**
- ตั้งยอดเงินในกระปุก
- เพิ่ม/ลด transaction ย้อนหลัง
- จำลองกระปุกเต็ม
- Reset ข้อมูลทั้งหมด
- เลือก scenario สำหรับ Demo (เช่น Scenario A: ผู้ใช้เพิ่งเริ่มออม, Scenario B: ออมมา 1 เดือน)

---

## 4. Tech Stack

### Frontend (Web App)
```
Framework:  Next.js 14 (React) + TypeScript
Styling:    Tailwind CSS
Animation:  Framer Motion หรือ Lottie
Charts:     Chart.js หรือ Recharts
Sound:      Web Audio API + mp3 files
Deploy:     Vercel
```

### Backend
```
Database:   Firebase Firestore (realtime) หรือ Supabase
Auth:       Firebase Auth (simple phone/email)
API:        Next.js API Routes
```

### ไฟล์เสียง
```
- เสียง "เงินเข้าแล้ว!" — ใช้ไฟล์ .mp3 หรือ Web Speech API (Thai TTS)
- เสียงเหรียญกระทบ — ใช้ไฟล์ .mp3 sound effect
- ที่เก็บไฟล์: /public/sounds/
```

---

## 5. User Flow หลัก (Main User Journey)

```
[เปิดแอป]
    ↓
[หน้าหลัก: แสดงกระปุก + ยอดเงิน]
    ↓
[กดปุ่ม "หยอดเงิน"]
    ↓
[เลือกจำนวนเงิน]
    ↓
[Animation + เสียง "เงินเข้าแล้ว!"]
    ↓
[ยอดเงินอัปเดต]
    ↓
[ถ้าถึง milestone → แสดงแจ้งเตือนพิเศษ]
    ↓
[ผู้ใช้ดูสถิติ / สิทธิ์ที่ได้]
```

---

## 6. หน้าจอทั้งหมด (Screens)

| หน้า | คำอธิบาย |
|------|----------|
| `/` | หน้าหลัก: รูปกระปุก + ยอดเงิน + ปุ่มหยอดเงิน |
| `/stats` | สถิติการออมรายวัน/รายเดือน (กราฟ) |
| `/rewards` | สิทธิประโยชน์และ Tier ของผู้ใช้ |
| `/invest` | แนะนำการลงทุนและเปิดบัญชีกรุงไทย |
| `/admin` | Admin panel สำหรับ Demo (ซ่อนจาก URL ปกติ) |

---

## 7. สิ่งที่ไม่ทำใน Prototype นี้ (Out of Scope)

- ❌ เชื่อมต่อ sensor จริง (Hardware ทำ)
- ❌ เชื่อม API จริงของกรุงไทย (ต้องมี partnership)
- ❌ Solar cell (Hardware ทำ)
- ❌ Push notification จริงบนมือถือ
- ❌ การโอนเงินจริง
- ❌ KYC / ยืนยันตัวตนจริง

---

## 8. Design Guidelines

```
สี (Colors):
  Primary:    #1A56DB (น้ำเงิน — สีหลักกรุงไทย)
  Secondary:  #F59E0B (ทอง — ออม/เงิน)
  Success:    #10B981 (เขียว — เงินเข้า)
  Background: #F9FAFB (ขาวอมเทา)

ฟอนต์: Sarabun (Google Fonts — ภาษาไทยสวย อ่านง่าย)

สไตล์:
  - ปุ่มใหญ่ touch-friendly (min 48px)
  - ไอคอนชัดเจน มีข้อความกำกับ
  - ไม่มีศัพท์ยาก / ภาษาอังกฤษ
  - Animation ไม่เยอะเกิน ไม่วิงเวียน
```

---

## 9. Demo Scenarios (สำหรับ Presentation)

### Scenario A: ผู้ใช้ใหม่ (ยอด 0 บาท)
1. เปิดแอป → เห็นกระปุกว่าง
2. กดหยอดเหรียญ → ได้ยินเสียง + animation
3. ดูสถิติว่าเพิ่งเริ่มวันแรก

### Scenario B: ออมมา 1 เดือน (ยอด 800 บาท)
1. Admin ตั้งข้อมูล 30 วัน + ยอด 800 บาท
2. เปิดแอป → เห็นสถิติที่น่าประทับใจ
3. กดหยอดเงิน → ถึง 1,000 บาท → กระปุกเต็ม!
4. แจ้งเตือน "ไปฝากธนาคารได้แล้ว"

### Scenario C: ถึงขั้น Gold Tier
1. Admin ตั้งยอด 5,000 บาท (ขั้น Gold)
2. แสดงสิทธิ์ที่ได้รับ: คูปองส่วนลด, ของที่ระลึก
3. แสดงหน้าแนะนำลงทุนกับกรุงไทย

---

## 10. Timeline (แนะนำ)

| วัน | งาน |
|-----|-----|
| วันที่ 1 | Setup โปรเจกต์, สร้างหน้าหลัก + ปุ่มหยอดเงิน |
| วันที่ 2 | เพิ่มเสียง, animation, ระบบ Database |
| วันที่ 3 | หน้าสถิติ, หน้าสิทธิ์, Admin Panel |
| วันที่ 4 | หน้าแนะนำการลงทุน, ระบบแจ้งเตือน |
| วันที่ 5 | Test, ปรับ UI, Deploy Vercel, ซักซ้อม Demo |

---

## 11. คำสั่งสำหรับ Claude Code

เมื่อเริ่มใช้ Claude Code ให้พิมพ์คำสั่งเหล่านี้ใน terminal:

```bash
# เริ่มต้น
> Read this PRD.md and create a complete project plan

# สร้างโปรเจกต์
> Create a Next.js project with Tailwind CSS for this piggy bank app

# ทีละส่วน (แนะนำ)
> Build the main home screen with the piggy bank UI and deposit button first

> Add Thai sound effect when the deposit button is clicked using Web Audio API

> Create the statistics page with a chart showing daily savings history

> Build the admin panel for demo control with ability to set balance and trigger scenarios
```

---

## 12. Version Control & Deployment
- **Repository:** https://github.com/Toodmuk/redesignbanking
- **Deployment:** Vercel (Auto-deploys from the GitHub repository)
- **Workflow:** After completing a major feature or at the end of a session, all code must be committed and pushed to the `main` branch of the repository so Vercel can automatically update the live prototype.

*สร้างด้วย Claude AI — โปรเจกต์นี้เป็น Prototype สำหรับ Hackathon*
