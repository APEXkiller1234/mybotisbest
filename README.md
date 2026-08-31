# mybotisbest

Admin-only Discord bot written in **JavaScript** (Node.js + discord.js).

Every command is restricted to admins. The current command set:

| Command       | Description                                                        | Access |
| ------------- | ------------------------------------------------------------------ | ------ |
| `!rules`      | Sends the server rules as an embed (JACE'S MM SERVICE | RULES).      | 🛡️ Admin only |
| `!mmpanel`    | Sends the Middleman Service panel with a ticket button.            | 🛡️ Admin only |
| `!mmtos`      | Posts the "Get a Manual Middleman" line with a **View ToS** button. | 🛡️ Admin only |
| `!leaderboard`| Posts the leaderboard: header + lifetime image, role/note text + monthly image. | 🛡️ Admin only |
| `!say` / `/say` | Makes the bot say any text, optionally as an embed.              | 🛡️ Admin only |
| `!setbot` / `/setbot` | Sets the bot status (online/idle/dnd/invisible) and activity (playing/watching/listening/competing/streaming/custom). | 🛡️ Admin only |
| `!cart`       | Posts the Jace's Middleman Service card (website + invite links, banner, embed). | 🛡️ Admin only |

**Server-name interaction:** when the server is renamed to `Horizon Shop`
the bot automatically changes its username **and role name** to a random
alive-looking name; when it's renamed back to `Jace's MM` it returns to
**JMS Bot**.

- `!mmpanel` sends the Middleman Service embed. Clicking **🔶 Request
  Middleman** opens a private ticket channel for the user (staff roles are
  pinged and given access).
- `!mmtos` posts the little "Get a Manual Middleman here -> #channels" line
  with a blue **View ToS** button. Clicking the button posts the full
  Middleman Terms of Service (auto-split across embeds if needed).

## Project hierarchy

```
mybotisbest/
├── package.json
├── config.example.json        # Channels / roles / category config (copy to config.json)
├── .env.example               # Token & bot settings template
├── .gitignore
└── src/
    ├── index.js               # Entry point — validates config and boots the bot
    ├── config.js              # Loads .env + config.json (JSON wins)
    ├── structures/
    │   ├── BotClient.js       # Custom client: auto-loads commands, slash commands + events
    │   ├── Command.js         # Base class/interface for commands
    │   └── Event.js           # Base class/interface for events
    ├── commands/
    │   └── admin/
    │       ├── rules.js       # The !rules command
    │       ├── mmpanel.js     # The !mmpanel command (embed + button)
    │       ├── mmtos.js       # The !mmtos command (line + View ToS button)
    │       ├── leaderboard.js # The !leaderboard command (images + notes)
│       ├── say.js         # The !say command (text / -e embed)
│       ├── setbot.js      # The !setbot command (status + activity)
│       └── cart.js        # The !cart command (website/invite + embed)
    ├── slash-commands/
    │   ├── say.js             # The /say command (text + embed option)
    │   └── setbot.js          # The /setbot command (status + activity)
    ├── events/
    │   ├── ready.js           # Login/status + slash command registration
    │   ├── messageCreate.js   # Command parser + admin gate (runs for ALL commands)
    │   ├── interactionCreate.js # Slash routing + button routing (tickets/ToS)
    │   └── guildUpdate.js     # Server rename → disguise/restore bot identity
    ├── content/
    │   ├── rules.js           # Exact text sent by !rules
    │   ├── mmpanel.js         # Exact embed/button content of the middleman panel
    │   ├── mmtos.js           # Loads mmtos.txt
    │   ├── mmtos.txt          # Full Middleman Terms of Service text
    │   ├── mmtosPanel.js      # The little panel line + View ToS button
    │   ├── leaderboard.js     # Leaderboard text templates
    │   └── cart.js            # !cart card content (links + embed)
    └── utils/
        ├── logger.js          # Timestamped console logging
        ├── permissions.js     # Admin check (owner, roles, Administrator fallback)
        ├── tickets.js         # Ticket channel creation/management
        ├── embeds.js          # Long-text → embed splitting (Discord 4096 limit)
        ├── images.js          # Leaderboard image loading (URL or local file)
        ├── time.js            # "Last Updated" timestamp formatting
        ├── say.js             # Shared /say + !say payload builder
        ├── presence.js        # Status/activity parsing + applying presence
        └── disguise.js        # Random-identity pools + apply/restore logic
```

## Setup

### 1. Create the bot

1. Go to <https://discord.com/developers/applications> → **New Application**.
2. Open **Bot** → copy the **token**.
3. Enable the **Message Content Intent** (required for `!` prefix commands).

### 2. Configure the project

```bash
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your-bot-token-here
PREFIX=!
ADMIN_ROLE_IDS=<role-id>            # comma-separated for multiple roles
BOT_OWNER_IDS=<user-id>             # optional owner bypass
```

### 3. Configure channels / roles / category

**Copy `config.example.json` → `config.json`** and fill in your IDs
(this is the main place for all channel/role/category settings):

```json
{
  "channels": {
    "mmRequestChannelId": "123456789012345678"
  },
  "tickets": {
    "categoryId": "123456789012345678",
    "staffRoleIds": ["123456789012345678", "987654321098765432"],
    "channelPrefix": "mm-",
    "mentionStaff": true,
    "welcomeTitle": "Middleman Ticket",
    "welcomeDescription": "Hey {user}, your middleman ticket has been opened! ..."
  }
}
```

| Section      | Key                  | What it does                                                        |
| ------------ | -------------------- | ------------------------------------------------------------------- |
| *(root)*     | `guildId`            | Register `/say` in this guild instantly (else global, slow).        |
| `channels`   | `mmRequestChannelId` | Channel linked by `!mmtos` and `!leaderboard` ("Manual tickets -> #..."). |
| `cart`       | `websiteUrl`         | Site URL posted by `!cart` (default `https://jaces.xyz/`).          |
| `cart`       | `inviteUrl`          | Server invite posted by `!cart` (Discord auto-renders the guild card). |
| `cart`       | `imageUrl`           | Optional banner image attached by `!cart`.                          |
| `cart`       | `imagePath`          | Optional local banner file (wins over the URL).                     |
| `leaderboard`| `lifetimeImageUrl`   | All-time leaderboard image attached by `!leaderboard`.              |
| `leaderboard`| `monthlyImageUrl`    | Monthly leaderboard image attached by `!leaderboard`.               |
| `leaderboard`| `lifetimeImagePath`  | Optional local file path (wins over the URL).                       |
| `leaderboard`| `monthlyImagePath`   | Optional local file path (wins over the URL).                       |
| `leaderboard`| `top3RoleId`         | Role mentioned as "Top 3 Clients" in the note.                      |
| `leaderboard`| `top10RoleId`        | Role mentioned as "Top 10 Clients" in the note.                     |
| `leaderboard`| `lastUpdated`        | Optional fixed "Last Updated" text; empty = current time.           |
| `tickets`    | `categoryId`         | Category where ticket channels are created.                         |
| `tickets`    | `staffRoleIds`       | Roles that can access tickets and are pinged when one opens.        |
| `tickets`    | `channelPrefix`      | Ticket channel name prefix (e.g. `mm-` → `mm-robloxuser`).          |
| `tickets`    | `mentionStaff`       | Ping staff roles inside the new ticket channel.                     |
| `tickets`    | `welcomeTitle`       | Title of the welcome embed.                                         |
| `tickets`    | `welcomeDescription` | Welcome text; `{user}` is replaced with the requester mention.      |

> Leaderboard images: set `lifetimeImageUrl` / `monthlyImageUrl` to your
> image URLs, or drop the files in `assets/` (or anywhere in the project)
> and use `lifetimeImagePath` / `monthlyImagePath`. A local path wins over a
> URL. If an image can't be loaded, the leaderboard text still sends —
> no image is attached.

| Section    | Key           | What it does                                                          |
| ---------- | ------------- | --------------------------------------------------------------------- |
| `disguise` | `enabled`     | Turn the server-name interaction on/off.                              |
| `disguise` | `shopName`    | Guild name that triggers the random identity (default `Horizon Shop`). |
| `disguise` | `homeName`    | Guild name that restores JMS Bot (default `Jace's MM`).               |
| `disguise` | `botName`     | Bot username restored on the home server (default `JMS Bot`).         |
| `disguise` | `roleName`    | Bot role name restored on the home server (default `JMS Bot`).        |
| `disguise` | `botNames`    | Random pool for the bot username while disguised.                     |
| `disguise` | `roleNames`   | Random pool for the bot role name while disguised.                    |

> The disguise needs the bot to have **Manage Roles** (to rename its own
> role) and can change the username at most ~2×/hour (Discord rate limit) —
> the bot skips re-applying names it already has. Matching is
> case-insensitive and treats `'` / `’` as the same.

> Everything can also live in `.env` (`TICKET_CATEGORY_ID`,
> `STAFF_ROLE_IDS`, `TICKET_CHANNEL_PREFIX`, `MM_REQUEST_CHANNEL_ID`).
> `config.json` takes priority; if unset, `!mmtos` links the channel it was
> run in, and tickets fall back to the category the panel was sent in.

**Finding IDs:** enable Developer Mode in Discord (Settings → Advanced), then
right-click the role/channel/category → *Copy ID*.

### 4. Invite the bot

Use the OAuth2 URL generator with the **bot** + **applications.commands**
scopes and these permissions: **View Channels · Send Messages · Read Message
History · Manage Channels · Manage Roles** (Manage Channels/Roles are needed
to create ticket channels with the right permissions and rename the bot role).

### 5. Run

```bash
npm install
npm start          # or: npm run dev (auto-restarts on file changes)
```

### 6. Post the panels

As an admin:

```
!rules        # server rules
!mmpanel      # Middleman Service panel + Request Middleman button
!mmtos        # Get a Manual Middleman line + View ToS button
!leaderboard  # header + lifetime image, role/note text + monthly image
!say hi       # bot says "hi"
!say -e hello # bot says "hello" as an embed
/say text:"hello" embed:true   # same thing as a slash command
!setbot dnd watching Roblox traders  # DND + "Watching Roblox traders"
!setbot online playing "with tickets" # Online + "Playing with tickets"
!setbot clear                        # clears the activity
/setbot status:dnd type:watching text:"Roblox traders"  # same via slash
!cart                                # website + invite + Middleman Service card
```

## How admins, tickets & ToS work

- **Admin access:** guild owner → `BOT_OWNER_IDS` → `ADMIN_ROLE_IDS` →
  Administrator permission (fallback only when no roles are configured).
- **Tickets:** clicking **🔶 Request Middleman** creates
  `mm-<username>` under the configured category; the user gets their own
  channel viewable only by them + staff roles, and staff are pinged.
  Clicking again while the ticket is open just links the existing channel.
- **ToS:** clicking **View ToS** posts the full terms (`src/content/mmtos.txt`)
  into the channel. The text is split across multiple embed descriptions
  automatically if it exceeds the 4096-character Discord limit.

## Adding a new command

1. Add a file in `src/commands/admin/` (e.g. `announce.js`).
2. Export the command:

```js
module.exports = {
  name: 'announce',
  description: 'Sends an announcement.',
  adminOnly: true,               // always true in this bot
  usage: '!announce <text>',
  execute(client, message, args) {
    return message.channel.send(args.join(' '));
  },
};
```

3. Restart the bot — it auto-loads from the folder. No registration needed.
