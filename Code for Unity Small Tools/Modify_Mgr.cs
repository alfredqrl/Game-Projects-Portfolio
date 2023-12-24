using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Modify_Mgr : MonoBehaviour
{   

    public MeshFilter meshFilter;
    public bool Updatemodifylist;
    public MeshModify[] modifies;

    Vector3[] vectorstemp, vectorsStart;


    void Start()
    {
        vectorsStart = meshFilter.mesh.vertices;

        GetModifys();
       
    }

    // Update is called once per frame
    void Update()
    {
        if (Updatemodifylist) { GetModifys(); }
        UpdateModifyEffect();
   
    }

  
    void GetModifys()
    {
        modifies=GetComponents<MeshModify>();
       
    }
 
    void UpdateModifyEffect()
    {   vectorstemp = vectorsStart;
        foreach (MeshModify m in modifies)
       
        {
            if (m.enabled)
            {
                vectorstemp = m.ModifyEffect(vectorstemp, meshFilter.transform);
            }

        }

        meshFilter.mesh.vertices=vectorstemp;
        meshFilter.mesh.RecalculateNormals();
    }
}
