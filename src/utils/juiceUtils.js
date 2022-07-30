import {analyticsFetch} from "../config/axiosConfig";

export function claimJuice() {
    return new Promise(async (resolve, reject) => {
        try {
            const {nextClaim,juiceBalance} = await analyticsFetch(`/fastJuiceClaim`)
            resolve({nextClaim,juiceBalance})
        } catch (e) {
            reject(e)
        }
    })
}