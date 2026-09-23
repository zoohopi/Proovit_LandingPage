# 2026-09-18 조명·지폐 리뉴얼

내장 image_gen으로 생성했습니다. 원본 pot-stage.png는 보존했습니다.

- pot-cutout-v2.png: 1448×1086, 알파 투명 저금통과 전광판. 기존 CSS polygon 누끼 대신 사용.
- bill-front.png, bill-curve.png, bill-back.png: 각 1536×1024, 알파 투명 지폐. 수직·지그재그·사선 낙하에 사용.
- 실제인증.jpg: 사용자 제공 원본 736×981. 4:3 슬롯에서 object-fit:cover, object-position:center 48%. 1280px 화면의 표시 크기 468×351, 390px 화면에서 약 303×227 CSS px. 잘림 없이 교체하려면 4:3 이미지(예: 1200×900)를 권장.

## 생성 프롬프트

공통 참조 이미지: assets/pot-stage.png.

### pot-cutout-v2.png

Use case: background-extraction. Edit target: supplied pot-stage image. Extract ONLY the exact piggy bank, its thin suspension cables and the entire blank rounded rectangular display sign below it onto genuinely transparent alpha. Preserve the original 4:3 canvas, object positions, scale, photographic detail, gold glass, all banknotes inside, and empty sign interior exactly. Remove ALL background stage, background light beams and floor outside the object silhouettes. Precision smooth antialiased contour, no polygon corners, no straight background patches around pig ears/body. Keep dark sign interior opaque. Output transparent PNG aligned to source.

### bill-front.png

Use case: stylized-concept. Generate one isolated Korean 50,000 won banknote animation sprite on genuinely transparent background, detailed engraved portrait and ornament, warm ochre yellow paper, clearly visible 50000 numerals, realistic fibrous paper and fine ink like the notes inside the supplied piggy bank reference. Single bill nearly frontal, slight natural bend at one corner, landscape banknote centered with modest transparent margin. Warm golden rim light, crisp detail, no floor, no background, no shadow rectangle. For miniature falling currency effect.

### bill-curve.png

Use case: stylized-concept. Generate one isolated Korean 50,000 won banknote animation sprite on genuinely transparent background. Detailed portrait, 50000 numerals, intricate ochre engraved paper matching notes in supplied piggy bank reference. Single bill with an elegant S-shaped flutter curvature, three-quarter oblique perspective, entire note visible, wide landscape framing and modest transparent margin. Photorealistic paper folds, amber and cream rim illumination, no background or floor.

### bill-back.png

Use case: stylized-concept. Generate one isolated Korean 50,000 won banknote animation sprite on genuinely transparent background. Reverse face bamboo and botanical ink motifs, 50000 numerals, pale ochre cream paper with crisp ornate fine linework matching supplied piggy bank scene. Single bill slightly curled lengthwise, diagonally tilted three-quarter perspective with entire banknote visible, landscape framing, modest transparent margins. Warm golden cinematic lighting, photographic paper texture, no background, no floor.
