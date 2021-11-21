const Utility = {
    randBetweenIntInc: function(min = 0, max = 100){
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min)
    },
    TOms: 
    /**
     * Converts small numbers into big numbers but they still equal the same thing.
     * @summary returns a time value in milliseconds
     * @param {number} h number of hours to convert to ms, accepts decimals
     * @param {number} m number of minutes to convert to ms, accepts decimals
     * @param {number} s number of seconds to convert to ms, accepts decimals
     */
    function({h = 0, m = 0, s = 0}){
        //This converts decimal values to actual values
        // console.log('Firing off converter!')
        // console.log(h,m,s)
        if (!Number.isInteger(h)){
            let decimal = h - Math.floor(h),
                convertedMinutes = decimal * 60
            m += convertedMinutes
            h = Math.floor(h)
        }
        if (!Number.isInteger(m)){
            let decimal = m - Math.floor(m),
                convertedSeconds = decimal * 60
            s += convertedSeconds
            m = Math.floor(m)
        }
        while (h > 0){
            h -= 1
            m += 60
        }
        while (m > 0){
            m -= 1
            s += 60
        }
        return Math.floor(s * 1000)
    }
}

export {
    Utility
}