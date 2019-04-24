import {
    sleep,
    DiscordAPI,
    DiscordConstants,
    DiscordUser,
    DiscordToken,
    DiscordMembers,
    DiscordMessages,
    SelectedGuildId,
    SelectedChannelId,
    DiscordReceiveMessages
} from './utilities';


/* DISTOOLS */
export default {
    async searchSharedFriends(userId) {
        var members = this.members;
        var result = [];

        for (var member of members) {
            if (!member.relationships) {
                var relationships = await DiscordAPI.get(DiscordConstants.Endpoints.USER_RELATIONSHIPS(member.userId));
                member.relationships = JSON.parse(relationships.text);
            }

            if (member.relationships.length) {
                result.push(member);
            }
        }

        if (userId) {
            var _arr = [];

            for (var member of result) {
                if (member.relationships.find(relationship => relationship.id === userId)) {
                    _arr.push(member);
                }
            }

            result = _arr;
        }

        return result;
    },

    searchOwnGuildMessages(guildId, authorId = this.userId, offset = 0) {
        return new Promise((resolve, reject) => {
            DiscordAPI.get(`${DiscordConstants.Endpoints.SEARCH_GUILD(guildId)}?author_id=${authorId}&include_nsfw=true&offset=${offset}`)
                .then(data => resolve(data.body))
                .catch(reject);
        });
    },

    searchOwnChannelMessages(channelId, authorId = this.userId, offset = 0) {
        return new Promise((resolve, reject) => {
            DiscordAPI.get(`${DiscordConstants.Endpoints.SEARCH_CHANNEL(channelId)}?author_id=${authorId}&offset=${offset}`)
                .then(data => resolve(data.body))
                .catch(reject);
        });
    },

    async deleteOwnGuildMessages() {
        var guildId = this.selectedGuildId;
        var result = await this.searchOwnGuildMessages(guildId);
        var count = 0;

        if (result) {
            if (result.total_results > 0) {
                this.progressBar.setSteps(result.total_results);

                do {
                    console.log(`${result.total_results} remaining messages.`);
                    await sleep(200);

                    for (var chunk of result.messages) {
                        for (var message of chunk) {
                            if (message.hit && !message.call) {
                                await this.deleteMessage(message.channel_id, message.id);
                                await sleep(200);
                                count++;
                            }
                        }

                        this.progressBar.setProgress(count);
                    }

                } while ((result = await this.searchOwnGuildMessages(guildId)) && (result.total_results > 0));
                console.log('Done.');

                await sleep(2000);
                this.progressBar.setProgress(0);

            } else console.log('No message to delete.');
        } else console.log('Index is not ready, try again.');
    },

    async deleteOwnChannelMessages() {
        var channelId = this.selectedChannelId;
        var result = await this.searchOwnChannelMessages(channelId);
        var count = 0;

        if (result) {
            if (result.total_results > 0) {
                this.progressBar.setSteps(result.total_results);

                do {
                    console.log(`${result.total_results} remaining messages.`);
                    await sleep(200);

                    for (var chunk of result.messages) {
                        for (var message of chunk) {
                            if (message.hit && !message.call) {
                                await this.deleteMessage(channelId, message.id);
                                await sleep(200);
                                count++;
                            }
                        }

                        this.progressBar.setProgress(count);
                    }

                } while ((result = await this.searchOwnChannelMessages(channelId)) && (result.messages.length > 0));
                console.log('Done.');

                await sleep(2000);
                this.progressBar.setProgress(0);

            } else console.log('No message to delete.');
        } else console.log('Index is not ready, try again.');
    },

    deleteMessage(channelId, messageId) {
        return new Promise((resolve, reject) => {
            DiscordAPI.delete(`${DiscordConstants.Endpoints.MESSAGES(channelId)}/${messageId}`)
                .then(data => resolve(data.body))
                .catch(reject);
        });
    },

    get receiveMessages() {
        return DiscordReceiveMessages;
    },

    get members() {
        return DiscordMembers.getMembers(this.selectedGuildId);
    },

    get selectedGuildId() {
        return SelectedGuildId.getGuildId();
    },

    get selectedChannelId() {
        return SelectedChannelId.getChannelId();
    },

    get messages() {
        return DiscordMessages.getMessages(this.selectedChannelId).toArray();
    },

    get userId() {
        return DiscordUser.getCurrentUser().id;
    },

    get token() {
        return DiscordToken.getToken();
    }
};