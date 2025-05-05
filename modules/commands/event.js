module.exports.config = {
	name: "event",
	version: "1.0.1",
	hasPermssion: 3,
	credits: "Mirai Team",
	description: "Quản lý/Kiểm soát toàn bộ module của bot",
	commandCategory: "config",
	usages: "[load/unload/loadAll/unloadAll/info] [tên module]",
	cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

module.exports.languages = {
    "vi": {
        "nameExist": "[ 𝗘𝗩𝗘𝗡𝗧 ] Tên module bị trùng với một module mang cùng tên khác!",
        "notFoundLanguage": "[ 𝗘𝗩𝗘𝗡𝗧 ] Module %1 không hỗ trợ ngôn ngữ ngôn ngữ của bạn",
        "notFoundPackage": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không tìm thấy package %1 hỗ trợ cho module %2, tiến hành cài đặt...",
        "cantInstallPackage": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không thể cài đặt package %1 cho module %2, lỗi: %3",
        "loadedPackage": "[ 𝗘𝗩𝗘𝗡𝗧 ] Đã tải thành công toàn bộ package cho module %1",
        "loadedConfig": "[ 𝗘𝗩𝗘𝗡𝗧 ] Đã tải thành công config cho module %1",
        "cantLoadConfig": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không thể tải config của module %1, lỗi: %2",
        "cantOnload": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không thể khởi chạy setup của module %1, lỗi: %1",
        "successLoadModule": "[ 𝗘𝗩𝗘𝗡𝗧 ] Đã tải thành công module %1",
        "failLoadModule": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không thể tải thành công module %1, lỗi: %2",
        "moduleError": "[ 𝗘𝗩𝗘𝗡𝗧 ] Những module đã xảy ra sự cố không mong muốn khi đang tải: \n\n%1",

        "unloadSuccess": "[ 𝗘𝗩𝗘𝗡𝗧 ] Đã hủy tải module %1",
        "unloadedAll": "[ 𝗘𝗩𝗘𝗡𝗧 ] Đã hủy tải %1 module",

        "missingInput": "[ 𝗘𝗩𝗘𝗡𝗧 ] Tên module không được để trống!",
        "moduleNotExist": "[ 𝗘𝗩𝗘𝗡𝗧 ] Module bạn nhập không tồn tại!",
        "dontHavePackage": "[ 𝗘𝗩𝗘𝗡𝗧 ] Không có",
        "infoModule": "=== %1 ===\n- Được code bởi: %2\n- Phiên bản: %3\n- Các package yêu cầu: %4"
    },
    "en": {
        "nameExist": "Module's name is similar to another module!",
        "notFoundLanguage": "Module %1 does not support your language",
        "notFoundPackage": "Can't find package %1 for module %2, install...",
        "cantInstallPackage": "Can't install package %1 for module %2, error: %3",
        "loadedPackage": "Loaded package for module %1",
        "loadedConfig": "Loaded config for module %1",
        "cantLoadConfig": "Can't load config for module %1, error: %2",
        "cantOnload": "Can't load setup for module %1, error: %1",
        "successLoadModule": "Loaded module %1",
        "failLoadModule": "Can't load module %1, error: %2",
        "moduleError": "Modules which have unexpected error when loading: \n\n%1",

        "unloadSuccess": "Unloaded module %1",
        "unloadedAll": "Unloaded %1 module",

        "missingInput": "Module's name can't be left blank!",
        "moduleNotExist": "Module you enter doesn't exist!",
        "dontHavePackage": "None",
        "infoModule": "=== %1 ===\n- Coded by: %2\n- Version: %3\n- Required package: %4"
    }
}

module.exports.loadCommand = function ({ moduleList, threadID, messageID, getText }) {
    const { execSync } = global.nodemodule["child_process"];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log");
    const listPackage = JSON.parse(readFileSync(global.client.mainPath + '/package.json')).dependencies;
    const listbuiltinModules = require("module").builtinModules;
    var errorList = [];

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        try {
            const dirModule = join(__dirname, "..", "events", `${nameModule}.js`);
            delete require.cache[require.resolve(dirModule)];
            var event = require(dirModule);
            if (!event.config || !event.run) throw new Error(getText("errorFormat"));

            if (event.config.dependencies && typeof event.config.dependencies == "object") {		
				for (const packageName in event.config.dependencies) {
					const moduleDir = join(global.client.mainPath, "nodemodules", "node_modules", packageName);
					try {
						if (!global.nodemodule.hasOwnProperty(packageName)) {
							if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
							else global.nodemodule[packageName] = require(moduleDir);
						}
					}
					catch {
                        var tryLoadCount = 0, loadSuccess = false, error;
						logger.loader(getText("notFoundPackage", packageName, event.config.name), "warn");
						execSync(`npm --package-lock false --save install ${packageName}${(event.config.dependencies[packageName] == "*" || event.config.dependencies[packageName] == "") ? "" : `@${event.config.dependencies[packageName]}`}`,
						{
                            stdio: "inherit",
                            env: process.env,
                            shell: true,
                            cwd: join(global.client.mainPath, "nodemodules")
						});

						for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
							require.cache = {}
							try {
                                require.cache = {};
								if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
								else global.nodemodule[packageName] = require(moduleDir);
								loadSuccess = true;
								break;
							}
							catch (e) { error = e }
							if (loadSuccess || !error) break;
						}
						if (!loadSuccess || error) throw getText("cantInstallPackage", packageName, event.config.name, error);
					}
				}
				logger.loader(getText("loadedPackage", event.config.name));
			}

            if (event.config.envConfig && typeof event.config.envConfig == "Object") {
                try {
					for (const key in event.config.envConfig) {
						if (typeof global.configModule[event.config.name] == "undefined") global.configModule[event.config.name] = {};
						if (typeof global.config[event.config.name] == "undefined") global.config[event.config.name] = {};
						if (typeof global.config[event.config.name][key] !== "undefined") global.configModule[event.config.name][key] = global.config[event.config.name][key];
						else global.configModule[event.config.name][key] = event.config.envConfig[key] || "";
						if (typeof global.config[event.config.name][key] == "undefined") global.config[event.config.name][key] = event.config.envConfig[key] || "";
					}
					logger.loader(getText("loadedConfig", event.config.name));
				}
                catch (error) { throw new Error(getText("loadedConfig", event.config.name, JSON.stringify(error))) }
            }

            if (event.onLoad) {
				try { event.onLoad({ api }) }
				catch (error) { throw new Error(getText("cantOnload", event.config.name, JSON.stringify(error)), "error") }
			}

            if (global.config["eventDisabled"].includes(`${nameModule}.js`) || configValue["eventDisabled"].includes(`${nameModule}.js`)) {
                configValue["eventDisabled"].splice(configValue["eventDisabled"].indexOf(`${nameModule}.js`), 1);
                global.config["eventDisabled"].splice(global.config["eventDisabled"].indexOf(`${nameModule}.js`), 1);
            }

            global.client.events.delete(nameModule);
            global.client.events.set(event.config.name, event);
			logger.loader(`[ 𝗘𝗩𝗘𝗡𝗧 ] Đã tải thành công ${event.config.name}!`);
        } catch (error) { errorList.push(getText("failLoadModule", event.config.name, error)) };
    }
    if (errorList.length != 0) api.sendMessage(getText("moduleError", errorList.join("\n\n")), threadID, messageID);
    api.sendMessage(`[ 𝗘𝗩𝗘𝗡𝗧 ] Đã tải thành công ${moduleList.length - errorList.length} module Events`, threadID, messageID);
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");
    return;
}

module.exports.unloadModule = function ({ moduleList, threadID, messageID, getText }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.events.delete(nameModule);
        configValue["eventDisabled"].push(`${nameModule}.js`);
        global.config["eventDisabled"].push(`${nameModule}.js`);
        logger(getText("unloadSuccess", nameModule));
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");

    return api.sendMessage(getText("unloadedAll", moduleList.length), threadID, messageID);
}

module.exports.run = function ({ event, args, api, getText }) {
    const permission = ["100038740121428", "100038740121428"]; if (!permission.includes(event.senderID)) return api.sendMessage("[ 𝗗𝗘𝗩 𝗠𝗢𝗗𝗘 ] Lệnh này chỉ dành cho 𝗡𝗵𝗮̀ 𝗣𝗵𝗮́𝘁 𝗧𝗿𝗶𝗲̂̉𝗻 💻", event.threadID, event.messageID);
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { threadID, messageID } = event;
    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
        case "load": {
            if (moduleList.length == 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
            else return this.loadCommand({ moduleList, threadID, messageID, getText });
        }
        case "unload": {
            if (moduleList.length == 0) return api.sendMessage(getText("missingInput"), threadID, messageID);
            else return this.unloadModule({ moduleList, threadID, messageID, getText });
        }
        case "loadAll": {
            moduleList = readdirSync(join(global.client.mainPath, "modules", "events")).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return this.loadCommand({ moduleList, threadID, messageID, getText });
        }
        case "unloadAll": {
            moduleList = readdirSync(join(global.client.mainPath, "modules", "events")).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return this.unloadModule({ moduleList, threadID, messageID, getText });
        }
        case "info": {
            const event = global.client.events.get(moduleList.join("") || "");
            if (!event) return api.sendMessage(getText("moduleNotExist"), threadID, messageID);
            const { name, version, credits, dependencies } = event.config;
            return api.sendMessage(getText("infoModule", name.toUpperCase(), credits, version, ((Object.keys(dependencies || {})).join(", ") || getText("dontHavePackage"))), threadID, messageID);
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}
