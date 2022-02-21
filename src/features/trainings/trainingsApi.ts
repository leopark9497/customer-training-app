
import axios from "axios"

export interface TrainingPostType {
    date: string,
    activity: string,
    duration: string,
    customer: string,
}

export async function fetchTrainings() {
    try {
        const response = await axios.get('https://customerrest.herokuapp.com/api/trainings')

        return response.data
    } catch(e) {
        console.log(e)
    }
}

export async function deleteTraining(trainingUrl: string) {
    try {
        const response = await axios.delete(trainingUrl)

        return response.data
    } catch(e) {
        console.log(e)
    }
}

export async function addTraining(trainingDetails: TrainingPostType) {
    try {
        const response = await axios
            .post('https://customerrest.herokuapp.com/api/trainings', {...trainingDetails, customer: `https://customerrest.herokuapp.com/api/customers/${trainingDetails.customer}`})

        return response.data
    } catch(e) {
        console.log(e)
    }
}