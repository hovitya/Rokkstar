<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:r="http://www.imagix-interactive/2012/Rokkstar">
    <xsl:output method="text" encoding="utf-8" indent="yes" />


    <xsl:variable name="rNS">http://www.imagix-interactive/2012/Rokkstar</xsl:variable>
    <xsl:variable name="rxNS">http://www.imagix-interactive/2012/Rokkstar/components</xsl:variable>
    <!--<xsl:variable name="htmlNS">http://www.w3.org/1999/xhtml</xsl:variable>-->





    <xsl:key name="kElemByNSURI"
             match="*[namespace::*[not(. = ../../namespace::*)]]"
             use="namespace::*[not(. = ../../namespace::*)]"/>
    <xsl:template match="/">
        <xsl:text>{{instance_name}}=Rokkstar.class('{{instance_name}}','</xsl:text>
        <xsl:for-each select="/*">
            <xsl:choose>
                <xsl:when test="namespace-uri(.)=$rxNS">
                    <xsl:text>core</xsl:text>
                </xsl:when>
                <xsl:when test="namespace-uri(.)=$rNS">
                    <xsl:text>core</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="namespace-uri(.)"/>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:text>.</xsl:text>
            <xsl:value-of select="local-name()"/>
        </xsl:for-each><xsl:text>',function(){</xsl:text>


        <!-- defining states -->
        <xsl:text disable-output-escaping="yes">this._buildDOM=function(){
            this.callSuper('_buildDOM');

        </xsl:text>
        <xsl:for-each select="//r:states">
            <xsl:for-each select="./*">
                <xsl:text>this.states["</xsl:text><xsl:value-of select="./@name"/><xsl:text>"]=</xsl:text><xsl:call-template name="createComponent"/><xsl:text>;</xsl:text>
                <xsl:text>var currentParent=[this.states["</xsl:text><xsl:value-of select="./@name"/><xsl:text>"]];</xsl:text>
                <xsl:call-template name="processAttributes"/>
            </xsl:for-each>
        </xsl:for-each>
        <xsl:text disable-output-escaping="yes">

        </xsl:text>
        <xsl:text disable-output-escaping="yes">
            var currentParent=[{addElement:function(element){}}];
        </xsl:text>
        <!-- parsing definitions -->
        <xsl:for-each select="//r:definitions">
            <xsl:for-each select="./*">
                <xsl:if test="namespace-uri(.)!=$rNS">
                    <xsl:call-template name="process"/>
                </xsl:if>
            </xsl:for-each>
        </xsl:for-each>

        <xsl:text disable-output-escaping="yes">
            var currentParent=[this];
        </xsl:text>
        <!-- parsing children -->
        <xsl:for-each select="./*">
            <xsl:if test="namespace-uri(.)!=$rNS">
                <xsl:call-template name="process"/>
            </xsl:if>
        </xsl:for-each>
        <xsl:text>this.buildDOM(); }</xsl:text>






        <xsl:for-each select="//r:script">
            <xsl:value-of select="."/>
        </xsl:for-each>

        <xsl:text>});&#10;</xsl:text>
    </xsl:template>

    <xsl:template name="process">
        <!-- process children -->
        <xsl:for-each select="./*">
            <xsl:if test="namespace-uri()!=$rNS">
                <xsl:text disable-output-escaping="yes">currentParent.push(</xsl:text><xsl:call-template
                    name="createComponent"/><xsl:text disable-output-escaping="yes">);</xsl:text><xsl:text>&#10;</xsl:text>
                                <xsl:text disable-output-escaping="yes">
                    currentParent[currentParent.length-2].addElement(currentParent[currentParent.length-1]);
                </xsl:text><xsl:text>&#10;</xsl:text>
                <xsl:call-template name="process"/>

            </xsl:if>
        </xsl:for-each>
         <xsl:call-template name="processAttributes"/>
         <xsl:text disable-output-escaping="yes">
            currentParent.pop();
         </xsl:text>
    </xsl:template>

    <xsl:template name="createComponent">
        <xsl:text>this.createComponent('</xsl:text>
        <xsl:choose>
            <xsl:when test="namespace-uri(.)=$rxNS">
                <xsl:text>core</xsl:text>
            </xsl:when>
            <xsl:when test="namespace-uri(.)=$rNS">
                <xsl:text>core</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="namespace-uri(.)"/>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>.</xsl:text>
        <xsl:value-of select="local-name()"/>
        <xsl:text>')</xsl:text>
    </xsl:template>

    <xsl:template name="processAttributes">
        <!-- process attributes -->
        <xsl:for-each select="./@*">
            <xsl:if test="local-name()='id'">
                <xsl:text>this['</xsl:text><xsl:value-of select="."/><xsl:text>']=currentParent[currentParent.length-1];&#10;</xsl:text>
            </xsl:if>
            <xsl:if test="namespace-uri(.)!=$rNS and not(contains(local-name(),'.'))">
                <xsl:text>currentParent[currentParent.length-1].set('</xsl:text><xsl:value-of select="local-name()"/><xsl:text>',"</xsl:text><xsl:value-of select="."/><xsl:text>");&#10;</xsl:text>
            </xsl:if>
            <xsl:if test="namespace-uri(.)!=$rNS and contains(local-name(),'.')">
                <xsl:text>this.states["</xsl:text><xsl:value-of select="substring-after(local-name(),'.')"/><xsl:text>"].addProperty(currentParent[currentParent.length-1],"</xsl:text><xsl:value-of select="substring-before(local-name(),'.')"/><xsl:text>","</xsl:text><xsl:value-of select="."/><xsl:text>");&#10;</xsl:text>
            </xsl:if>
        </xsl:for-each>
        <!-- process linked attributes -->
        <xsl:for-each select="./r:*">
            <xsl:if test="local-name()='id'">
                <xsl:text>this['</xsl:text><xsl:value-of select="."/><xsl:text>']=currentParent[currentParent.length-1];&#10;</xsl:text>
            </xsl:if>
            <xsl:if test="namespace-uri(.)=$rNS and local-name()!='script' and local-name()!='definitions' and local-name()!='states' and local-name()!='transitions'">

                <xsl:if test="self::text()"> <xsl:text>currentParent[currentParent.length-1].set('</xsl:text><xsl:value-of select="local-name()"/><xsl:text>',</xsl:text><xsl:text>"</xsl:text><xsl:value-of select="."/><xsl:text>"</xsl:text><xsl:text disable-output-escaping="yes">);</xsl:text><xsl:text>&#10;</xsl:text></xsl:if>
                <xsl:if test="not(self::text())">
                    <xsl:variable name="propName"><xsl:value-of select="local-name()"/></xsl:variable>
                    <xsl:if test="count(*)=1">
                        <xsl:for-each select="./*">
                            <xsl:text disable-output-escaping="yes">currentParent.push(</xsl:text><xsl:call-template
                                name="createComponent"/><xsl:text disable-output-escaping="yes">);</xsl:text><xsl:text>&#10;</xsl:text>
                            <xsl:if test="not(contains($propName,'.'))">
                                <xsl:text>currentParent[currentParent.length-2].set('</xsl:text><xsl:value-of select="$propName"/><xsl:text disable-output-escaping="yes">',currentParent[currentParent.length-1]);</xsl:text><xsl:text>&#10;</xsl:text>
                            </xsl:if>
                            <xsl:if test="contains($propName,'.')">
                                <xsl:text>this.states["</xsl:text><xsl:value-of select="substring-after($propName,'.')"/><xsl:text>"].addProperty(currentParent[currentParent.length-2],"</xsl:text><xsl:value-of select="substring-before($propName,'.')"/><xsl:text>",currentParent[currentParent.length-1]);&#10;</xsl:text>
                            </xsl:if>
                            <xsl:call-template name="process"/>
                        </xsl:for-each>
                    </xsl:if>
                </xsl:if>

            </xsl:if>
        </xsl:for-each>
    </xsl:template>




</xsl:stylesheet>