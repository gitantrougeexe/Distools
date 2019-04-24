/* Sleep function */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* Webpack modules recovery utility */
export class WebpackModules {
    static byProperties(props, filter = m => m) {
        return module => {
            const component = filter(module);
            if (!component) return false;
            return props.every(property => component[property] !== undefined);
        };
    }

    static getByProps(...props) {
        return this.getModule(this.byProperties(props), true);
    }

    static getModule(filter, first = true) {
        const modules = this.getAllModules();
        const rm = [];
        for (const index in modules) {
            if (!modules.hasOwnProperty(index)) continue;
            const module = modules[index];
            const { exports } = module;
            let foundModule = null;

            if (!exports) continue;
            if (exports.__esModule && exports.default && filter(exports.default)) foundModule = exports.default;
            if (filter(exports)) foundModule = exports;
            if (!foundModule) continue;
            if (first) return foundModule;
            rm.push(foundModule);
        }
        return first || rm.length == 0 ? undefined : rm;
    }

    static getAllModules() {
        return this.require.c;
    }

    static get require() {
        if (this._require) return this._require;
        const id = "zl-webpackmodules";
        const __webpack_require__ = typeof (window.webpackJsonp) == "function" ? window.webpackJsonp([], {
            [id]: (module, exports, __webpack_require__) => exports.default = __webpack_require__
        }, [id]).default : window.webpackJsonp.push([[], {
            [id]: (module, exports, __webpack_require__) => module.exports = __webpack_require__
        }, [[id]]]);
        delete __webpack_require__.m[id];
        delete __webpack_require__.c[id];
        return this._require = __webpack_require__;
    }
}


/* Collect Discord modules */
export const React = WebpackModules.getByProps("createElement", "cloneElement");
export const ReactDOM = WebpackModules.getByProps("render", "findDOMNode");

export const DiscordAPI = WebpackModules.getByProps("getAPIBaseURL");
export const DiscordConstants = WebpackModules.getByProps("Permissions", "ActivityTypes", "StatusTypes");
export const DiscordUser = WebpackModules.getByProps("getCurrentUser");
export const DiscordToken = WebpackModules.getByProps("getToken");

export const DiscordMembers = WebpackModules.getByProps("getMember");
export const DiscordChannels = WebpackModules.getByProps("getChannels");
export const DiscordMessages = WebpackModules.getByProps("getMessages");
export const SelectedGuildId = WebpackModules.getByProps("getLastSelectedGuildId");
export const SelectedChannelId = WebpackModules.getByProps("getLastSelectedChannelId");

export const DiscordReceiveMessages = WebpackModules.getByProps("receiveMessage", "sendBotMessage");