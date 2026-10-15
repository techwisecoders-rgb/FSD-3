"""
Workflow Connect — Cinematic Video & Poster Generator
Renders an original 120-frame (30 fps) 720p cinematic animation
strictly using the 5 authorized brand colors:
- Light mint background: #E7F4E8
- Secondary light green: #A8D5A8
- Brand green: #66BB6A
- Deep forest green: #1B5E20
- White: #FFFFFF

Outputs:
- public/videos/workflow-connect-hero.mp4
- public/images/workflow-connect-poster.webp
"""

import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SEC = 4.0
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 120 frames

# 5 Authoritative Brand Colors (RGBA)
MINT_BG = (231, 244, 232)          # #E7F4E8
SECONDARY_GREEN = (168, 213, 168)  # #A8D5A8
BRAND_GREEN = (102, 187, 106)      # #66BB6A
DEEP_FOREST = (27, 94, 32)         # #1B5E20
WHITE = (255, 255, 255)            # #FFFFFF

TRADE_NODES = [
    {"name": "Home Repairs", "angle": 0, "dist": 220},
    {"name": "Electrical", "angle": 60, "dist": 250},
    {"name": "Plumbing", "angle": 120, "dist": 210},
    {"name": "Carpentry", "angle": 180, "dist": 230},
    {"name": "Painting", "angle": 240, "dist": 240},
    {"name": "Transport", "angle": 300, "dist": 215},
]

# Client / Request beacon points
CLIENT_BEACONS = [
    {"angle": 30, "dist": 340},
    {"angle": 90, "dist": 310},
    {"angle": 150, "dist": 350},
    {"angle": 210, "dist": 320},
    {"angle": 270, "dist": 360},
    {"angle": 330, "dist": 330},
]

def render_frame(t):
    """
    t ranges from 0.0 to 1.0 across the 120 frames
    Stage 1: Discovery (0.00 - 0.20)
    Stage 2: Skills Emerge (0.20 - 0.45)
    Stage 3: Connection (0.45 - 0.70)
    Stage 4: Network (0.70 - 0.90)
    Stage 5: Resolution (0.90 - 1.00)
    """
    img = Image.new("RGBA", (WIDTH, HEIGHT), (*MINT_BG, 255))
    draw = ImageDraw.Draw(img)

    # Dynamic camera center with subtle cinematic float
    cx = WIDTH / 2 + math.sin(t * math.pi * 2) * 12
    cy = HEIGHT / 2 + math.cos(t * math.pi * 2) * 8

    # 1. Background geometric perspective grid & subtle radar circles
    grid_alpha = int(40 + 20 * math.sin(t * math.pi))
    for r in [120, 220, 320, 420, 520]:
        r_dyn = r + math.sin(t * math.pi * 4 + r * 0.01) * 8
        draw.ellipse(
            [cx - r_dyn, cy - r_dyn * 0.65, cx + r_dyn, cy + r_dyn * 0.65],
            outline=(*SECONDARY_GREEN, grid_alpha),
            width=1
        )

    # Grid radial spokes
    for i in range(12):
        rad = math.radians(i * 30 + t * 45)
        ex = cx + math.cos(rad) * 600
        ey = cy + math.sin(rad) * 400
        draw.line([(cx, cy), (ex, ey)], fill=(*SECONDARY_GREEN, int(grid_alpha * 0.6)), width=1)

    # Stage progressions
    s1_prog = min(1.0, max(0.0, t / 0.20))
    s2_prog = min(1.0, max(0.0, (t - 0.20) / 0.25))
    s3_prog = min(1.0, max(0.0, (t - 0.45) / 0.25))
    s4_prog = min(1.0, max(0.0, (t - 0.70) / 0.20))
    s5_prog = min(1.0, max(0.0, (t - 0.90) / 0.10))

    # Calculate 3D trade node positions
    node_positions = []
    for i, node in enumerate(TRADE_NODES):
        ang_rad = math.radians(node["angle"] + t * 60)
        # nodes emerge and expand outward
        expansion = s2_prog
        dist = node["dist"] * (0.3 + 0.7 * expansion)
        nx = cx + math.cos(ang_rad) * dist
        ny = cy + math.sin(ang_rad) * dist * 0.7
        node_positions.append((nx, ny, node["name"], i))

    # Calculate client beacons
    beacon_positions = []
    for i, b in enumerate(CLIENT_BEACONS):
        ang_rad = math.radians(b["angle"] - t * 30)
        dist = b["dist"] * (0.5 + 0.5 * s3_prog)
        bx = cx + math.cos(ang_rad) * dist
        by = cy + math.sin(ang_rad) * dist * 0.7
        beacon_positions.append((bx, by))

    # Stage 3 & 4: Connection pathways between trades and beacons
    if s3_prog > 0:
        for i, (nx, ny, _, _) in enumerate(node_positions):
            # Connect node to central hub
            path_alpha = int(s3_prog * 180)
            draw.line([(cx, cy), (nx, ny)], fill=(*DEEP_FOREST, path_alpha), width=2)

            # Connect node to adjacent nodes (Hexagonal lattice)
            next_idx = (i + 1) % len(node_positions)
            nnx, nny, _, _ = node_positions[next_idx]
            draw.line([(nx, ny), (nnx, nny)], fill=(*BRAND_GREEN, int(s3_prog * 150)), width=2)

            # Moving energy pulse packet along trade-to-trade line
            pulse_offset = (t * 3 + i * 0.2) % 1.0
            px = nx + (nnx - nx) * pulse_offset
            py = ny + (nny - ny) * pulse_offset
            draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(*WHITE, 230), outline=(*BRAND_GREEN, 255), width=2)

            # Connect to client beacons
            if s4_prog > 0:
                bx, by = beacon_positions[i]
                draw.line([(nx, ny), (bx, by)], fill=(*SECONDARY_GREEN, int(s4_prog * 200)), width=1)
                # Client pulse
                b_offset = (t * 4 + i * 0.3) % 1.0
                cpx = nx + (bx - nx) * b_offset
                cpy = ny + (by - ny) * b_offset
                draw.ellipse([cpx - 3, cpy - 3, cpx + 3, cpy + 3], fill=(*BRAND_GREEN, 200))

    # Stage 4 & 5: Geodesic network polygons & web
    if s4_prog > 0:
        poly_points = [(p[0], p[1]) for p in node_positions]
        draw.polygon(poly_points, outline=(*BRAND_GREEN, int(s4_prog * 180)), fill=(*SECONDARY_GREEN, int(s4_prog * 35)))

    # Draw client beacon indicators
    if s3_prog > 0:
        for bx, by in beacon_positions:
            b_alpha = int(s3_prog * 200)
            draw.ellipse([bx - 6, by - 6, bx + 6, by + 6], fill=(*WHITE, b_alpha), outline=(*DEEP_FOREST, b_alpha), width=2)
            draw.ellipse([bx - 12, by - 12, bx + 12, by + 12], outline=(*BRAND_GREEN, int(b_alpha * 0.5)), width=1)

    # Draw Trade Nodes
    if s2_prog > 0:
        for nx, ny, name, idx in node_positions:
            node_alpha = int(s2_prog * 255)
            # Outer halo
            halo_size = 22 + math.sin(t * 8 + idx) * 4
            draw.ellipse([nx - halo_size, ny - halo_size, nx + halo_size, ny + halo_size],
                         outline=(*BRAND_GREEN, int(node_alpha * 0.4)), width=2)

            # Node disc
            draw.ellipse([nx - 16, ny - 16, nx + 16, ny + 16],
                         fill=(*WHITE, node_alpha), outline=(*DEEP_FOREST, node_alpha), width=3)

            # Inner symbol geometry (Wrench/circuit/pipe/hammer/brush/truck abstraction)
            draw.ellipse([nx - 7, ny - 7, nx + 7, ny + 7], fill=(*BRAND_GREEN, node_alpha))
            draw.ellipse([nx - 3, ny - 3, nx + 3, ny + 3], fill=(*DEEP_FOREST, node_alpha))

            # Orbital mini satellite
            sat_rad = math.radians(t * 360 * 2 + idx * 60)
            sx = nx + math.cos(sat_rad) * 26
            sy = ny + math.sin(sat_rad) * 26
            draw.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=(*DEEP_FOREST, node_alpha))

    # Central Workflow Connect Core Hub
    core_scale = 1.0 + (0.15 * math.sin(t * math.pi * 4))
    r_core = 48 * core_scale

    # Concentric orbital rings around hub
    for ring_i, (ring_r, ring_speed, ring_col) in enumerate([
        (72, -1.5, SECONDARY_GREEN),
        (90, 1.0, BRAND_GREEN),
        (110, -0.8, DEEP_FOREST),
    ]):
        rot_ang = t * ring_speed * math.pi * 2
        draw.ellipse([cx - ring_r, cy - ring_r * 0.65, cx + ring_r, cy + ring_r * 0.65],
                     outline=(*ring_col, 160), width=2)
        # Ring satellites
        for sp in range(3):
            sp_rad = rot_ang + sp * (math.pi * 2 / 3)
            spx = cx + math.cos(sp_rad) * ring_r
            spy = cy + math.sin(sp_rad) * ring_r * 0.65
            draw.ellipse([spx - 4, spy - 4, spx + 4, spy + 4], fill=(*WHITE, 240), outline=(*ring_col, 255), width=2)

    # Core base shield
    draw.ellipse([cx - r_core, cy - r_core, cx + r_core, cy + r_core],
                 fill=(*WHITE, 255), outline=(*DEEP_FOREST, 255), width=4)

    # Core inner ring
    draw.ellipse([cx - r_core * 0.72, cy - r_core * 0.72, cx + r_core * 0.72, cy + r_core * 0.72],
                 fill=(*SECONDARY_GREEN, 120), outline=(*BRAND_GREEN, 255), width=3)

    # Core central emblem (The interlocking 'W' & 'C' node geometry)
    ew = r_core * 0.45
    draw.polygon([
        (cx - ew, cy - ew * 0.4),
        (cx - ew * 0.5, cy + ew * 0.8),
        (cx, cy - ew * 0.2),
        (cx + ew * 0.5, cy + ew * 0.8),
        (cx + ew, cy - ew * 0.4),
        (cx + ew * 0.4, cy - ew * 0.4),
        (cx + ew * 0.2, cy + ew * 0.2),
        (cx, cy - ew * 0.5),
        (cx - ew * 0.2, cy + ew * 0.2),
        (cx - ew * 0.4, cy - ew * 0.4),
    ], fill=(*DEEP_FOREST, 255))

    # Stage 5 Resolution Glow / Accents
    if s5_prog > 0:
        res_r = 130 + s5_prog * 30
        draw.ellipse([cx - res_r, cy - res_r * 0.65, cx + res_r, cy + res_r * 0.65],
                     outline=(*BRAND_GREEN, int(s5_prog * 200)), width=3)

    return img.convert("RGB")

def main():
    os.makedirs("public/videos", exist_ok=True)
    os.makedirs("public/images", exist_ok=True)

    video_path = os.path.abspath("public/videos/workflow-connect-hero.mp4")
    poster_path = os.path.abspath("public/images/workflow-connect-poster.webp")

    print(f"Generating {TOTAL_FRAMES} frames ({FPS} fps, {WIDTH}x{HEIGHT})...")
    frames = []
    for i in range(TOTAL_FRAMES):
        t = i / float(TOTAL_FRAMES - 1)
        frame = render_frame(t)
        frames.append(frame)
        if i % 30 == 0 or i == TOTAL_FRAMES - 1:
            print(f"Rendered frame {i+1}/{TOTAL_FRAMES} (t={t:.2f})")

    # Save Poster Image at mid-story point (Frame 60)
    poster_frame = frames[60]
    poster_frame.save(poster_path, "WEBP", quality=92)
    print(f"Saved poster to {poster_path}")

    # Render MP4 Video using ffmpeg (via imageio-ffmpeg or cv2 fallback)
    ffmpeg_exe = None
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        print(f"Found imageio ffmpeg executable: {ffmpeg_exe}")
    except Exception as e:
        print("imageio_ffmpeg not ready yet, checking system:", e)

    if ffmpeg_exe and os.path.exists(ffmpeg_exe):
        print("Encoding H.264 MP4 with optimal intra-refresh keyframes for smooth scrubbing...")
        cmd = [
            ffmpeg_exe,
            "-y",
            "-f", "rawvideo",
            "-vcodec", "rawvideo",
            "-s", f"{WIDTH}x{HEIGHT}",
            "-pix_fmt", "rgb24",
            "-r", str(FPS),
            "-i", "-",
            "-an",
            "-vcodec", "libx264",
            "-pix_fmt", "yuv420p",
            "-profile:v", "main",
            "-preset", "fast",
            "-crf", "20",
            "-g", "5",               # Keyframe every 5 frames for instant bidirectional scroll seeking!
            "-movflags", "+faststart", # Fast start for web streaming
            video_path
        ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        for frame in frames:
            proc.stdin.write(frame.tobytes())
        proc.stdin.close()
        proc.wait()
        print(f"Successfully encoded H.264 video to {video_path} (size: {os.path.getsize(video_path)} bytes)")
    else:
        # Fallback to OpenCV VideoWriter
        print("Using OpenCV VideoWriter fallback...")
        import cv2
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(video_path, fourcc, FPS, (WIDTH, HEIGHT))
        for frame in frames:
            # RGB to BGR for cv2
            bgr = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            out.write(bgr)
        out.release()
        print(f"Saved mp4v video to {video_path} (size: {os.path.getsize(video_path)} bytes)")

if __name__ == "__main__":
    main()
