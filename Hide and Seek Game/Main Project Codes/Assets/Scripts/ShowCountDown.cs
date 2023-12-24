using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class ShowCountDown : MonoBehaviour
{
    public float totalTime = 60f;
    public Text timerText;
    public float remainingTime;
    
    // Start is called before the first frame update
    void Start()
    {   
        SceneManager.UnloadSceneAsync("EndingMouse");
        SceneManager.UnloadSceneAsync("EndingCat");
        timerText.color = Color.white;
        remainingTime = totalTime;
    }

    // Update is called once per frame
    void Update()
    {
        remainingTime -= Time.deltaTime;
        if (remainingTime >= 0)
        {
            timerText.text = "Time Remain: " + remainingTime.ToString("F0") + "s";
        }
        else
        {
            showScore();
        }
    }
    void showScore()
    {
        Debug.Log("Time is up!!!!");
        SceneManager.LoadScene("EndingMouse");
    }
}
