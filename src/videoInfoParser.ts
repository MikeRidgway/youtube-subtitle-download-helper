export default class VideoInfoParser {
  constructor(private videoInfoResponse: any) {}

  public getCaptionsData(): Array<any> {
    if (!this.decodeVideoInfoResponse().captions.playerCaptionsTracklistRenderer.captionTracks) {
      throw new Error('This video has no captions.');
      //get_video_info sometimes fails to produce captions in videos that DO have captions, 
      //due to flags being set by the video creators, including the "do not embed" flag.  
      //You may want to check to see if the embeddable flag is true so that you could give a more accurate error message in such cases.

    }
    return this.decodeVideoInfoResponse().captions.playerCaptionsTracklistRenderer.captionTracks;
  }

  /**
   * Get video title and replace extra word.
   *
   * @returns {string}
   * @memberof VideoInfoParser
   */
  public getVideoTitle(): string {
    return this.decodeVideoInfoResponse()
      .videoDetails.title.replace(/\+\|/g, '')
      .replace(/[\+]/g, ' ')
      .replace(/[\?\^\.<>":]/g, '');
  }

  /**
   * Decode response JSON format.
   *
   * @private
   * @returns {*}
   * @memberof VideoInfoParser
   */
  private decodeVideoInfoResponse(): any {
    const decodedData = this.parseQuery(this.videoInfoResponse);
    return JSON.parse(decodedData.player_response);
  }

  /**
   * Parse videoinfo response.
   *
   * @private
   * @param {string} queryString
   * @returns
   * @memberof VideoInfoParser
   */
  private parseQuery(queryString: string) {
    let query: { [key: string]: any } = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }
}
