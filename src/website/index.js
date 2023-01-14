const express = require('express');
const url = require('url');
const path = require('path');
const fs = require('fs');
const discord = require('discord.js');
const ejs = require('ejs');
const passport = require('passport');
const bodyParser = require('body-parser');
const Strategy = require('passport-discord').Strategy;
const botConfig = require('../data/config.json');
const version = require('../../package.json').version;
const settings = require('./settings.json');
const logger = require('silly-logger');
const favicon = require('serve-favicon');
const fetch = require('node-fetch');
const compression = require('compression');

module.exports = client => {
	// website config backend
	const app = express();
	const session = require('express-session');
	const MemoryStore = require("memorystore")(session);

	// initialize discord login
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));
	passport.use(new Strategy({
		clientID: settings.config.clientID,
		clientSecret: settings.config.secret,
		callbackURL: settings.config.callback,
		scope: ["identify", "guilds", "guilds.join"],
	},
	(accessToken, refreshToken, profile, done) => {
		process.nextTick(()=>done(null, profile));
	},
	));

	app.use(session({
		store: new MemoryStore({ checkPeriod: 86400000 }),
		secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
		resave: false,
		saveUninitialized: false,
	}));

	// middleware
	app.use(passport.initialize());
	app.use(passport.session());

	app.set("view engine", "ejs");
	app.set("views", path.join(__dirname, "./views"));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(express.json());
	app.use(express.urlencoded({
		extended: true,
	}));

	app.use(favicon(path.join(__dirname, 'public/assets', 'favicon.ico')));

	// compression
	app.use(compression());

	// loading public
	app.use('/public', express.static(__dirname + '/public'));

	const checkAuth = (req, res, next) => {
		if (req.isAuthenticated()) return next();
		req.session.backURL = req.url;
		res.redirect("/login");
	};

	app.get("/login", (req, res, next) => {
		if (req.session.backURL) {
			// eslint-disable-next-line no-self-assign
			req.session.backURL = req.session.backURL;
		} else if (req.headers.referer) {
			const parsed = url.parse(req.headers.referer);
			if (parsed.hostname == app.locals.domain) {
				req.session.backURL = parsed.path;
			}
		} else {
			req.session.backURL = "/";
		}
		next();
	}, passport.authenticate("discord", { prompt: null }));

	app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
		res.redirect("/dashboard");
	});

	app.get("/logout", (req, res, next) => {
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.redirect("/");
        });
    });

	app.get("/", async (req, res) => {
		await client.guilds.fetch();
		let users = 0;
		client.guilds.cache.forEach(guild => {
			users += guild.memberCount;
		});

		let votes = 0;
		const response = await fetch(new URL(`https://top.gg/api/bots/${botConfig.clientId}`), {
			method: 'GET',
			headers: { 'Authorization': botConfig.discordBotListToken },
		});
		const data = await response.json();
		votes = data.points ? data.points : 0;

		const html = await ejs.renderFile('./src/website/views/index.ejs', {
			req: req,
			user: req.isAuthenticated() ? req.user : null,
			bot: client,
			Permissions: discord.PermissionsBitField,
			botconfig: settings.website,
			callback: settings.config.callback,
			servers: await client.guilds.cache.size,
			users: users,
			votes: votes,
			version: version,
			async: true,
		});

		res.send(html);
	});

	app.get("/dashboard", async (req, res) => {
        if (!req.isAuthenticated() || !req.user) {
			return res.redirect("/login");
		}
        if (!req.user.guilds) {
			return res.redirect("/?error=" + encodeURIComponent("Cannot get your Guilds"));
		}
		const html = await ejs.renderFile("./src/website/views/dashboard/dashboard.ejs", {
			req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: discord.PermissionsBitField,
            botconfig: settings.website,
            callback: settings.config.callback,
			async: true,
		});

		res.send(html);
	});

	app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
		const guild = await client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me first!"));
        let member = guild.members.cache.get(req.user.id);
		if (!member) {
			try {
				member = await guild.members.fetch(req.user.id);
			} catch {
				// no
			}
		}
		if (!member) return res.redirect("/?error=" + encodeURIComponent("Please login! / Join the guild again!"));
		if (!member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to manage that guild!"));
		if (!req.isAuthenticated() || !req.user) return res.redirect("/login");

		const html = await ejs.renderFile("./src/website/views/dashboard/settings.ejs", {
			req: req,
            user: req.isAuthenticated() ? req.user : null,
			guild: guild,
            bot: client,
            Permissions: discord.PermissionsBitField,
            botconfig: settings.website,
            callback: settings.config.callback,
			async: true,
		});
		res.send(html);
    });

	app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
		const guild = await client.guilds.cache.get(req.params.guildID);
		if (!guild) return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me first!"));
        let member = guild.members.cache.get(req.user.id);
		if (!member) {
			try {
				member = await guild.members.fetch(req.user.id);
			} catch {
				// no
			}
		}
		if (!member) return res.redirect("/?error=" + encodeURIComponent("Please login! / Join the guild again!"));
		if (!member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to manage that guild!"));
		if (!req.isAuthenticated() || !req.user) return res.redirect("/login");

		// check if welcome was enabled via the guild dashboard
		if (req.body["welcomeToggler-settings"]) {
			const dbClient = client.dbClient;
			const db = dbClient.db("darling");
			const collection = db.collection("welcome");
			const filter = {
				_id: guild.id,
			};
			let result = await collection.findOne(filter);
			if (!result) {
				const doc = {
					"_id": guild.id,
					"channelId": "unset",
					"headline": "unset",
					"message": "unset",
					"thumbnail": false,
					"image": [false, "unset"],
					"color": "#618eb1",
					"dm": [false, "unset"],
					"role": [false, "unset"],
					"enabled": false,
				};
				await collection.insertOne(doc);
			}
			result = await collection.findOne(filter);
			if (req.body["welcomeToggler-settings"]) {
				switch (req.body["welcomeToggler-settings"]) {
					case "off": {
						const updateDocument = {
							$set: {
								"enabled": false,
							},
						};
						await collection.updateOne(result, updateDocument);
						break;
					}
					case "on": {
						const updateDocument = {
							$set: {
								"enabled": true,
							},
						};
						await collection.updateOne(result, updateDocument);
						return res.redirect(`/dashboard/${guild.id}/welcome`);
					}
				}
			}
		}

		const html = await ejs.renderFile("./src/website/views/dashboard/settings.ejs", {
			req: req,
            user: req.isAuthenticated() ? req.user : null,
			guild: guild,
            bot: client,
            Permissions: discord.PermissionsBitField,
            botconfig: settings.website,
            callback: settings.config.callback,
			async: true,
		});
		res.send(html);
    });

	app.get("/dashboard/:guildID/:botFunction", checkAuth, async (req, res) => {
		const guild = await client.guilds.cache.get(req.params.guildID);
		const botFunction = req.params.botFunction;
		if (!guild) return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me first!"));
        let member = guild.members.cache.get(req.user.id);
		if (!member) {
			try {
				member = await guild.members.fetch(req.user.id);
			} catch {
				// no
			}
		}
		if (!member) return res.redirect("/?error=" + encodeURIComponent("Please login! / Join the guild again!"));
		if (!member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to manage that guild!"));
		if (!req.isAuthenticated() || !req.user) return res.redirect("/login");

		const functions = fs.readdirSync('src/website/views/dashboard/functions');
		for (let i = 0; i < functions.length; i++) {
			const filename = functions[i].split(".")[0];
			functions[i] = filename;
		}
		if (!functions.includes(botFunction)) {
			return res.redirect(`${settings.website.domain}/dashboard/${guild.id}/?error=` + encodeURIComponent(`The requested page "${botFunction}" is not existing.`));
		}

		const html = await ejs.renderFile(`./src/website/views/dashboard/functions/${botFunction}.ejs`, {
			req: req,
			res: res,
            user: req.isAuthenticated() ? req.user : null,
			guild: guild,
            bot: client,
            Permissions: discord.PermissionsBitField,
            botconfig: settings.website,
            callback: settings.config.callback,
			async: true,
		});
		res.send(html);
    });

	app.post("/dashboard/:guildID/:botFunction", checkAuth, async (req, res) => {
		const guild = await client.guilds.cache.get(req.params.guildID);
		const botFunction = req.params.botFunction;
		if (!guild) return res.redirect("/?error=" + encodeURIComponent("I am not in this Guild yet, please add me first!"));
        let member = guild.members.cache.get(req.user.id);
		if (!member) {
			try {
				member = await guild.members.fetch(req.user.id);
			} catch {
				// no
			}
		}
		if (!member) return res.redirect("/?error=" + encodeURIComponent("Please login! / Join the guild again!"));
		if (!member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return res.redirect("/?error=" + encodeURIComponent("You are not allowed to manage that guild!"));
		if (!req.isAuthenticated() || !req.user) return res.redirect("/login");

		const functions = fs.readdirSync('src/website/views/dashboard/functions');
		for (let i = 0; i < functions.length; i++) {
			const filename = functions[i].split(".")[0];
			functions[i] = filename;
		}
		if (!functions.includes(botFunction)) {
			return res.redirect(`${settings.website.domain}/dashboard/${guild.id}/?error=` + encodeURIComponent(`The requested page "${botFunction}" is not existing.`));
		}

		// check if user is managing welcome function
		if (botFunction == "welcome") {
			const dbClient = client.dbClient;
			const db = dbClient.db("darling");
			const collection = db.collection("welcome");
			const filter = {
				_id: guild.id,
			};
			let result = await collection.findOne(filter);
			if (!result) {
				const doc = {
					"_id": guild.id,
					"channelId": "unset",
					"headline": "unset",
					"message": "unset",
					"thumbnail": false,
					"image": [false, "unset"],
					"color": "#618eb1",
					"dm": [false, "unset"],
					"role": [false, "unset"],
					"enabled": false,
				};
				await collection.insertOne(doc);
			}
			result = await collection.findOne(filter);
			if (req.body.welcomeToggler) {
				switch (req.body.welcomeToggler) {
					case "off": {
						const updateDocument = {
							$set: {
								"enabled": false,
							},
						};
						await collection.updateOne(result, updateDocument);
						break;
					}
					case "on": {
						const updateDocument = {
							$set: {
								"enabled": true,
							},
						};
						await collection.updateOne(result, updateDocument);
						break;
					}
				}
			} else if (!req.body.welcomeToggler) {
				if (req.body.welcomeThumbnail == "true") {
					req.body.welcomeThumbnail = true;
				} else {
					req.body.welcomeThumbnail = false;
				}
				const forcedUpdateDocument = {
					$set: {
						"channelId": req.body.welcomeChannel,
						"headline": req.body.welcomeEmbedHeadline,
						"message": req.body.welcomeEmbedText,
						"thumbnail": req.body.welcomeThumbnail,
						"color": req.body.welcomeEmbedColor,
					},
				};
				await collection.updateMany(filter, forcedUpdateDocument);

				if (req.body.welcomeImageCheck == "true") {
					const updateDocument = {
						$set: {
							"image": [true, req.body.welcomeImageURL],
						},
					};
					await collection.updateOne(filter, updateDocument);
				} else {
					const updateDocument = {
						$set: {
							"image": [false, req.body.welcomeImageURL],
						},
					};
					await collection.updateOne(filter, updateDocument);
				}

				if (req.body.welcomeDmCheck == "true") {
					const updateDocument = {
						$set: {
							"dm": [true, req.body.welcomeDmText],
						},
					};
					await collection.updateOne(filter, updateDocument);
				} else {
					const updateDocument = {
						$set: {
							"dm": [false, req.body.welcomeDmText],
						},
					};
					await collection.updateOne(filter, updateDocument);
				}

				if (req.body.welcomeRoleCheck == "true") {
					const updateDocument = {
						$set: {
							"role": [true, req.body.welcomeRole],
						},
					};
					await collection.updateOne(filter, updateDocument);
				} else {
					const updateDocument = {
						$set: {
							"role": [false, req.body.welcomeRole],
						},
					};
					await collection.updateOne(filter, updateDocument);
				}
			}
		}

        const html = await ejs.renderFile(`./src/website/views/dashboard/functions/${botFunction}.ejs`, {
			req: req,
            user: req.isAuthenticated() ? req.user : null,
			guild: guild,
            bot: client,
            Permissions: discord.PermissionsBitField,
            botconfig: settings.website,
            callback: settings.config.callback,
			async: true,
		});
		res.send(html);
    });

	app.get("/vote", (req, res) => {
		return res.redirect("https://top.gg/bot/743150068726628440/");
	});

	app.get("/support", (req, res) => {
		return res.redirect("https://discord.gg/tpUr7d3");
	});

	app.get("/invite", (req, res) => {
		return res.redirect("https://discord.com/oauth2/authorize?client_id=743150068726628440&permissions=8&scope=bot%20applications.commands");
	});

	app.get("/terms-of-service", async (req, res) => {
		const html = await ejs.renderFile('./src/website/views/terms-of-service.ejs', {
			req: req,
			user: req.isAuthenticated() ? req.user : null,
			bot: client,
			Permissions: discord.PermissionsBitField,
			botconfig: settings.website,
			callback: settings.config.callback,
			async: true,
		});

		res.send(html);
	});

	const http = require('http').createServer(app);
	http.listen(settings.config.port, () => {
		logger.success(`Website is online on port ${settings.config.port}, ${settings.website.domain}`);
	});
};