I want to redesign the editor architecture while keeping the current AXIOM visual language exactly as it is.

Do NOT redesign the overlay visuals.

This is purely an editor UX and architecture improvement.

## Overall Architecture

The application should have three major sections.

---------------------------------------------------------

LEFT SIDEBAR

Contains:

• Scene Navigation
• Scene List
• Scene Selection

Examples:

Starting Soon

Live Gameplay

Just Chatting

Be Right Back

Stream Ending

Only one scene can be selected at a time.

---------------------------------------------------------

CENTER

This is the Broadcast Preview Canvas.

It is a 1920×1080 preview of the selected scene.

IMPORTANT:

The canvas should ONLY render what the stream viewers will see.

Never render editor controls inside the canvas.

Never render property panels.

Never render configuration controls.

Never render buttons such as Pause, Reset or Save.

The preview must remain a clean broadcast output.

Think of it exactly like the Program Output inside professional broadcast software.

---------------------------------------------------------

RIGHT SIDEBAR

This becomes the Scene Configuration Panel.

Whenever a scene is selected, the right panel changes automatically to show only the configuration options for that scene.

The panel should use the existing AXIOM design language.

Use collapsible sections.

Use Auto Layout.

Use reusable components.

Maintain consistent spacing.

---------------------------------------------------------

The editor should become completely data-driven.

Instead of manually editing every text object on the canvas, every scene should be built from reusable configurable sections.

Think of each section as an independent component.

Examples:

• Countdown
• Music Widget
• Stream Title
• Social Links
• Schedule
• QR Code
• Chat Panel
• Goal Bars
• Recent Events
• Latest Follow
• Latest Subscriber
• Latest Donation
• Top Donator
• Footer
• Background
• VTuber Area
• Gameplay Area
• Alert Area

Each component should expose only the settings relevant to it.

---------------------------------------------------------

Scene Configuration Structure

Every scene should have the same editor layout.

General

Appearance

Content

Widgets

Animations

Advanced

This creates consistency across all scenes.

---------------------------------------------------------

GENERAL

Contains:

Scene Name

Scene Status

Output Resolution

Scene Notes

---------------------------------------------------------

APPEARANCE

Contains:

Theme

Accent Color

Corner Radius

Glass Effect

Opacity

Background Style

Ambient Effects

Density

---------------------------------------------------------

CONTENT

Contains editable values only.

Example:

Title

Subtitle

Current Game

Rank

Schedule

Footer Message

Thank You Message

Users edit values here instead of editing text directly on the canvas.

---------------------------------------------------------

WIDGETS

Widgets should be modular.

Each widget can simply be enabled or disabled.

Example

☑ Countdown

☑ Music Widget

☑ Chat

☑ Goal Bars

☐ Schedule

☑ Recent Events

☑ Latest Follow

☐ Latest Subscriber

☐ QR Code

☑ Social Links

☐ Sponsor Panel

Disabling a widget should instantly remove it from the layout.

The remaining layout should automatically reflow using Auto Layout.

There should never be empty gaps.

---------------------------------------------------------

SOCIAL LINKS

Instead of individual text editing,

show toggle switches.

Example

☑ Twitch

☑ YouTube

☐ Discord

☐ Kick

☐ X

☐ Instagram

☐ TikTok

☐ Website

Each enabled platform exposes:

Display Name

Username

URL

Icon

Disabling a platform immediately removes it from the overlay.

The footer automatically re-centers itself.

---------------------------------------------------------

COUNTDOWN COMPONENT

Only visible for scenes that contain countdown timers.

For example:

Starting Soon

BRB

The Countdown component should contain:

Current Time

Start

Pause

Reset

+30 Seconds

-30 Seconds

+1 Minute

-1 Minute

Quick Presets

5 Minutes

10 Minutes

15 Minutes

30 Minutes

Auto Switch Scene

Running Status

Paused Status

These controls exist ONLY inside the right configuration panel.

Never inside the broadcast preview.

---------------------------------------------------------

GAMEPLAY COMPONENT

Only visible for Gameplay scenes.

Contains:

Gameplay Placeholder

Enable Gameplay Region

Enable VTuber Region

Enable Chat

Enable Events

Enable Goal Bars

Enable Footer

Gameplay Area Color

(Default should be Chroma Green)

Maintain Safe Margins

---------------------------------------------------------

VTUBER COMPONENT

Contains:

Enable VTuber

Avatar Position

Avatar Scale

Background Theme

Background Blur

Room Theme

Lighting Preset

Ambient Effects

Idle Animation

This configures the VTuber area without affecting the rest of the layout.

---------------------------------------------------------

BACKGROUND COMPONENT

Users can choose

Dark

Cyber

Gaming Room

Anime Room

Lo-fi Room

Minimal

City Night

Japanese Apartment

Studio

Custom Image

The background updates instantly in the preview.

---------------------------------------------------------

LAYOUT ENGINE

Every scene should be assembled from reusable blocks.

Example

Starting Soon

Logo

Countdown

Stream Title

Music Widget

Latest Follow

Social Links

Background

Gameplay

Gameplay Region

VTuber Region

Chat

Goal Bars

Recent Events

Footer

Alerts

Background

BRB

Countdown

Music

Social Links

Latest Follow

Footer

Background

Each block should support:

Visible

Order

Content

Style

Animation

The editor should never allow users to accidentally break the layout.

---------------------------------------------------------

The layout engine should automatically adapt whenever components are enabled or disabled.

The user should never manually reposition widgets after hiding a section.

The editor should preserve visual balance automatically.

---------------------------------------------------------

The final editor should feel closer to professional broadcast software than a traditional graphics editor.

Think of the editor as a Broadcast Control Panel where the center is always the viewer output, the left manages scenes, and the right manages scene configuration.