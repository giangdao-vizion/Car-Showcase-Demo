# 3D Car Showcase — Nghiên cứu thị trường & Kế hoạch triển khai

## 1. Mục tiêu sản phẩm

Xây dựng một **demo triển lãm xe 3D trên web** với:

- Không gian showroom nhỏ đủ để trưng bày một mẫu xe
- Menu tương tác dùng **thuật ngữ chuyên môn ô tô** (headlamp, grille, side mirror, door panel, alloy wheel, bucket seat…)
- Khi chọn một mục menu → camera **tự động focus** vào bộ phận tương ứng
- Cấu hình màu sơn (và tùy chọn: chi tiết kim loại, kính)
- Góc nhìn preset (front ¾, rear, side profile, top, cockpit…)
- Stack: **Three.js + HTML/CSS/JS thường**, load qua CDN / ES modules — **không cần Vite/Webpack**, chạy trên **GitHub Pages**

Repo hiện tại: `Car-Showcase-Demo` (đã bật GitHub Pages, `index.html` còn TBD).

---

## 2. Khảo sát demo / sản phẩm tương tự trên thị trường

### 2.1. Tham chiếu “đúng bài” (nên học pattern)

| # | Tên | Link | Điểm mạnh liên quan demo của ta | Ghi chú kỹ thuật |
|---|-----|------|----------------------------------|------------------|
| 1 | **three.js — Materials Car** | [webgl_materials_car](https://threejs.org/examples/webgl_materials_car.html) · [source](https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_car.html) | Đổi màu Body / Details / Glass realtime; model Ferrari 458 glTF + Draco; ground grid + env map | **Vanilla JS** — gần nhất với stack đề xuất |
| 2 | **Toyota Mirai WebGL** (Groove Jones) | [case study](https://www.groovejones.com/toyota-mirai-webgl) · [live](https://toyotamirai.groove-tech.com/) | Hotspot trên xe → popup nội dung + **camera zoom vào feature**; đổi màu/wheels; nội thất 360° | Chuẩn UX “menu/hotspot → focus bộ phận” |
| 3 | **smart 3D Configurator** (Demodern) | [case](https://www.demodern.de/en/projects/smart-web-configurator) | Cinematic camera rig thay vì chỉ orbit; hotspot nối detail view; e-commerce | Học motion camera, không cần copy e-commerce |
| 4 | **Koenigsegg Jesko × Loop Studio** | [loop-studio.io/jesko](https://loop-studio.io/jesko) | Showroom/studio + track; mở cửa dihedral; ghế/nội thất từ góc cockpit | Production-grade; tham chiếu cảm giác “triển lãm” |
| 5 | **Blend4Web Car Configurator** | [demo](https://www.blend4web.com/en/demo/car_configurator/) | Đổi màu, mở cửa, xem nội thất, bật đèn pha | Demo cổ điển, UX rõ ràng |

### 2.2. Open-source / community gần với yêu cầu

| # | Tên | Link | Pattern học được |
|---|-----|------|------------------|
| 6 | **PorscheLab** | [GitHub](https://github.com/ASTRICKK/PorscheLab) | Camera keyframe 6-DOF; exterior presets; interior mode; toggle headlight; `CameraControls.setLookAt` |
| 7 | **Auto Gallery** | [Devpost](https://devpost.com/software/auto-gallery-prg7hy) | Showroom + hotspots + guided demo; mở cửa, cabin, wheels; OrbitControls |
| 8 | **3d-car-viewing** | [GitHub](https://github.com/jiaxiantao/3d-car-viewing) | Menu bộ phận theo **mesh name**; paint palette; scene modes (studio/day/night); camera presets |
| 9 | **Supercar-Vault-3D** | [GitHub](https://github.com/Nissmo89/Supercar-Vault-3D) | Vanilla JS + Three CDN + GSAP; cấu trúc file đơn giản, phù hợp GitHub Pages |
| 10 | **car-visualizer** (Badgerloop) | [GitHub Pages](https://badgerloop-software.github.io/car-visualizer/) | Showroom mode + camera presets + `localStorage`; deploy Pages sẵn |
| 11 | **ApexConfig 3D** | [GitHub](https://github.com/arjunsudarshana-code/apexconfig-3d) | Cinematic lerp camera khi focus component (R3F — tham khảo ý tưởng, không dùng React) |

### 2.3. Pattern UX/kỹ thuật rút ra từ thị trường

1. **Hai lớp điều khiển camera**
   - Free orbit (kéo xoay / pinch zoom) khi khám phá tự do
   - **Preset / focus transition** khi chọn menu hoặc hotspot (smooth `setLookAt` / lerp 0.8–1.5s)

2. **Menu bộ phận ≠ hotspot 3D (nhưng nên có cả hai về sau)**
   - Phase 1: panel UI (HTML) với thuật ngữ chuyên môn → focus camera
   - Phase 2 (optional): hotspot billboard trên mesh, sync với cùng data

3. **Cấu hình màu tách khỏi focus**
   - Color swatches / picker độc lập (như three.js car example)
   - Focus menu không nên “nuốt” toàn bộ UI — layout: canvas full-bleed + panel cạnh

4. **Showroom tối giản**
   - Floor có reflection hoặc shadow catcher
   - Soft HDRI / hemisphere + directional (không cần thành phố phức tạp như smart)
   - Backdrop tối hoặc gradient studio — xe là hero

5. **Model phải có named nodes**
   - Demo thất bại thường do pivot/mesh không tách tên → `getWorldPosition` giống nhau
   - Cần map `partId → meshName | anchorOffset` trong JS config

6. **Stack phù hợp GitHub Pages**
   - Import map + `three` từ CDN (jsDelivr / unpkg) **hoặc** vendor `three.module.js` trong repo
   - GLB + Draco decoder path tương đối
   - Không phụ thuộc build step; nếu sau này muốn minify thì optional CI

---

## 3. Định vị demo của chúng ta (MVP)

**Khác biệt so với “chỉ đổi màu”:** trọng tâm là **menu thuật ngữ chuyên môn → camera focus bộ phận** trong không gian triển lãm nhỏ.

**Không làm trong MVP:** mua xe, tài chính, nhiều model, animation mở cửa phức tạp, interior walkthrough đầy đủ, e-commerce.

**Có làm trong MVP:**

- 1 xe GLB trong showroom
- Đổi màu sơn (body) + optional details/glass
- Panel menu theo nhóm Exterior / Lighting / Cabin / Wheels
- Click item → camera animate tới góc nhìn bộ phận + highlight nhẹ mesh
- Orbit tự do sau khi focus
- Nút “Reset view” về góc hero

---

## 4. Thuật ngữ & cấu trúc menu đề xuất

Nhóm hiển thị trong panel (có thể song ngữ EN + chú thích VI ngắn):

### Exterior
| ID | Term (EN) | Gợi ý VI | Camera target |
|----|-----------|----------|---------------|
| `grille` | Front grille | Lưới tản nhiệt | Mặt trước, hơi thấp |
| `hood` | Hood / Bonnet | Nắp capo | Trên nắp máy, góc ¾ |
| `fender` | Front fender | Vè trước | Góc vè + wheel arch |
| `side_skirt` | Side skirt | Ốp hông | Profile thấp bên thân |
| `spoiler` | Rear spoiler | Cánh gió sau | Góc sau cao |
| `diffuser` | Rear diffuser | Bộ khuếch tán | Gầm sau |
| `door_panel` | Door panel | Cánh cửa | Góc nghiêng cửa lái |
| `side_mirror` | Side-view mirror | Gương chiếu hậu | Close-up gương |

### Lighting
| ID | Term (EN) | Gợi ý VI |
|----|-----------|----------|
| `headlamp` | Headlamp assembly | Cụm đèn pha |
| `drl` | Daytime running light (DRL) | Đèn ban ngày |
| `taillight` | Taillight cluster | Cụm đèn hậu |
| `fog_lamp` | Fog lamp | Đèn sương mù |

### Cabin (nếu model có nội thất; không thì ẩn hoặc focus qua kính)
| ID | Term (EN) | Gợi ý VI |
|----|-----------|----------|
| `steering_wheel` | Steering wheel | Vô lăng |
| `dashboard` | Instrument panel / Dashboard | Táp lô |
| `bucket_seat` | Sport bucket seat | Ghế bucket |
| `center_console` | Center console | Bệ trung tâm |

### Wheels & chassis
| ID | Term (EN) | Gợi ý VI |
|----|-----------|----------|
| `alloy_wheel` | Alloy wheel | Mâm hợp kim |
| `brake_caliper` | Brake caliper | Heo dầu phanh |
| `tire_sidewall` | Tire sidewall | Hông lốp |

Data-driven: mỗi item là object trong `parts.js` — dễ thêm/bớt không đụng scene.

---

## 5. Kiến trúc kỹ thuật đề xuất

### 5.1. Cấu trúc thư mục (no-build)

```text
/
├── index.html              # Shell UI + import map
├── css/
│   └── showcase.css
├── js/
│   ├── main.js             # Bootstrap scene, loop
│   ├── showroom.js         # Floor, lights, HDRI, backdrop
│   ├── car.js              # Load GLB, materials, paint API
│   ├── camera-tour.js      # Orbit + focusTo(partId) transitions
│   ├── parts.js            # Menu data + mesh/anchor mapping
│   └── ui.js               # Bind menu, color picker, presets
├── assets/
│   ├── models/car.glb
│   ├── env/                # Optional .hdr hoặc dùng RoomEnvironment
│   └── textures/           # Shadow AO nếu dùng kiểu three.js car
├── vendor/                 # Optional: pin three + addons nếu không muốn CDN
├── docs/
│   └── RESEARCH-AND-PLAN.md
└── README.md
```

### 5.2. Thư viện

| Lib | Vai trò | Cách nạp |
|-----|---------|----------|
| **three** (r160+) | Renderer, scene, materials | ES module CDN hoặc vendor |
| **GLTFLoader + DRACOLoader** | Load xe | `three/addons/...` |
| **OrbitControls** *hoặc* **camera-controls** | Orbit + smooth `setLookAt` | Ưu tiên **camera-controls** (yomotsu) cho transition mượt như PorscheLab |
| **RoomEnvironment / HDRLoader** | IBL cho sơn metallic | Có sẵn trong addons |
| **lil-gui** (optional) | Debug mesh names khi map parts | Chỉ môi trường dev |

**Không dùng:** React, R3F, Vite, Webpack — giữ đúng yêu cầu “chạy thẳng trên Pages”.

### 5.3. Luồng focus bộ phận

```text
User click menu item (partId)
    → ui.js gọi cameraTour.focusPart(partId)
    → parts.js trả { target, cameraPos, highlightMeshes[] }
    → car.js highlight meshes (emissive hoặc outline tạm)
    → camera-controls.setLookAt(cam, target, true)
    → sau transition: cho phép orbit quanh target mới
```

Nếu mesh pivot không đúng tâm bộ phận: dùng **anchor điểm thủ công** (Vector3 local trên xe) thay vì `getWorldPosition(mesh)` — pattern bắt buộc đã thấy trên StackOverflow / các demo thực tế.

### 5.4. Đổi màu

- Clone / giữ `MeshPhysicalMaterial` cho body (`metalness` cao, `roughness` thấp, `clearcoat`)
- UI: swatch palette (5–8 màu) + color input
- Áp dụng `material.color.set(hex)` — giống official car example

### 5.5. Model 3D — lựa chọn

| Ưu tiên | Asset | License | Lý do |
|---------|-------|---------|-------|
| A (khuyến nghị MVP) | **three.js Ferrari** `ferrari.glb` (từ repo three.js examples) | Theo license model three.js examples (attribution) | Đã có named materials `body`, `glass`, `rim_*`, wheels; code reference sẵn |
| B | **Khronos CarConcept** | CC BY 4.0 | Nhiều material (Headlight, Paint, Interior…) — map menu dễ |
| C | Sketchfab CC0 concept car (Unity Fan) | CC0 | Đẹp nhưng nặng; cần nén Draco + kiểm tra named nodes |
| D | Kenney Car Kit GLB | CC0 | Nhẹ, stylized — tốt prototype UI trước khi đổi model hi-fi |

**Quyết định đề xuất:** bắt đầu bằng **Ferrari từ three.js examples** để ship nhanh UX; sau đó có thể thay GLB nếu cần branding riêng (chỉ sửa `parts.js` mapping).

---

## 6. UI / UX layout

```text
┌────────────────────────────────────────────────────────┐
│  BRAND / Demo title                          [Reset]   │
│┌──────────────┐  ┌────────────────────────────────────┐│
││ PARTS MENU   │  │                                    ││
││ ▸ Exterior   │  │         WebGL Canvas               ││
││   · Grille   │  │         (full-bleed showroom)      ││
││   · Headlamp │  │                                    ││
││ ▸ Lighting   │  │                                    ││
││ ▸ Cabin      │  │                                    ││
││ ▸ Wheels     │  │                                    ││
││──────────────│  │                                    ││
││ PAINT        │  │                                    ││
││ ● ● ● ● ●   │  │                                    ││
││──────────────│  │                                    ││
││ VIEWS        │  │                                    ││
││ Hero · Side  │  └────────────────────────────────────┘│
││ Rear · Top   │                                        │
└────────────────────────────────────────────────────────┘
```

- Desktop: panel trái ~280–320px, canvas chiếm phần còn lại
- Mobile: bottom sheet / drawer cho menu; canvas full screen
- Motion: fade panel items, camera ease-in-out; tránh clutter card/stat

---

## 7. Lộ trình triển khai theo giai đoạn

### Phase 0 — Nền tảng repo (0.5–1 phiên)
- [ ] Cấu trúc thư mục như §5.1
- [ ] `index.html` + import map Three CDN
- [ ] Xác nhận GitHub Pages serve từ root / `docs` / Actions (repo đã `has_pages: true`)
- [ ] Local preview: `python3 -m http.server` (không mở `file://`)

### Phase 1 — Showroom + xe + orbit
- [ ] Scene, camera, renderer, resize, pixel ratio cap
- [ ] Lights + RoomEnvironment / HDR
- [ ] Floor (shadow / grid mờ kiểu three.js car)
- [ ] Load `car.glb` + Draco
- [ ] OrbitControls / camera-controls cơ bản
- [ ] Loading overlay

### Phase 2 — Paint + materials
- [ ] Body / details / glass materials
- [ ] Color swatches UI
- [ ] (Optional) wheel spin idle rất nhẹ

### Phase 3 — Parts menu + camera focus (core value)
- [ ] `parts.js` với thuật ngữ chuyên môn
- [ ] Map mesh names / anchors sau khi inspect model (log `traverse`)
- [ ] `focusPart()` + highlight
- [ ] View presets (hero, side, rear, top)
- [ ] Reset view

### Phase 4 — Polish GitHub Pages
- [ ] Mobile layout
- [ ] Performance: DPR ≤ 2, shadow map size vừa phải
- [ ] Attribution model + three.js trong footer
- [ ] README hướng dẫn chạy / deploy
- [ ] (Optional) GitHub Action `peaceiris/actions-gh-pages` nếu cần build; **MVP không cần**

### Phase 5 — Mở rộng (sau MVP)
- [ ] Hotspot 3D sync menu
- [ ] Đèn pha on/off (emissive)
- [ ] Mở cửa / interior mode
- [ ] Đổi env studio / night
- [ ] Nhiều màu mâm / ghế

---

## 8. Checklist kỹ thuật quan trọng

1. **Luôn serve HTTP** — GLTF/Draco fail trên `file://`
2. **Pin version Three** trên CDN để Pages không vỡ khi upstream đổi API
3. **Inspect mesh names** ngay sau load: `car.traverse(o => o.isMesh && console.log(o.name))`
4. **Anchors thủ công** cho part không có pivot đúng
5. **Disable user input** trong lúc camera transition (tránh conflict Orbit)
6. **Giữ GLB < ~5–8 MB** (Draco) để Pages load nhanh
7. **License**: ghi credit model trong UI/README

---

## 9. Tiêu chí “xong demo”

Người dùng mở URL GitHub Pages và trong ~30 giây có thể:

1. Xoay xem xe trong showroom
2. Đổi màu sơn
3. Mở menu, chọn ví dụ **Headlamp assembly** → camera zoom mượt vào đèn pha
4. Chọn **Alloy wheel** → focus mâm
5. Bấm Reset → về góc hero

---

## 10. Đề xuất bước tiếp theo ngay

1. **Chốt asset:** Ferrari three.js examples (nhanh) *hoặc* Khronos CarConcept (nhiều named materials hơn cho menu)
2. **Implement Phase 0–3** theo thứ tự trên
3. **Deploy** lên Pages và tinh chỉnh anchor từng part bằng mắt

Tài liệu này là baseline để bắt đầu code; mapping `parts.js` sẽ được cập nhật sau khi có GLB cụ thể trong repo.


## 11. Implementation status

**Shipped on branch `cursor/jesko-car-showcase-3c42`** as **Atelier 458** — vanilla Three.js configurator inspired by Loop Studio Jesko:

- Studio / Gallery environments
- Paint, details, caliper, glass, leather
- Body Parts menu (EN + VI) → camera focus + highlight
- View presets, headlamps, idle wheel spin
- Ferrari 458 GLB + local Draco; CDN Three.js / camera-controls
